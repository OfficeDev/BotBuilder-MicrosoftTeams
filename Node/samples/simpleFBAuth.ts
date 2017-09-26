import * as teams from 'botbuilder-teams';
import * as builder from 'botbuilder';
import * as restify from 'restify';
import * as crypto from 'crypto';
import * as request from 'request';

export interface IFacebookAppSigninSettings {
  baseUrl: string,
  fbAppClientId: string,
  fbAppClientSecret: string,
  fbAppScope: string
}

interface ISigninState {
  userId: string,
  accessCode: string,
  channelId?: string
}

export class SimpleFBAuth
{  
  // Endpoints used in this service
  private static readonly AuthStartPath: string = "/auth/start";
  private static readonly AuthStartOAuthPath: string = "/auth/oauth";
  private static readonly AuthCallbackPath: string = "/auth/callback";
  private static readonly TeamsSDK: string = 'https://statics.teams.microsoft.com/sdk/v1.0/js/MicrosoftTeams.min.js';

  private static instance: SimpleFBAuth;
  private settings: IFacebookAppSigninSettings;
  private connector: teams.TeamsChatConnector;
  private userIdFacebookTokenCache: {[userId: string]: string} = {};

  public static create(server: any, connector: teams.TeamsChatConnector, settings: IFacebookAppSigninSettings) {
    if (!SimpleFBAuth.instance) {
      SimpleFBAuth.instance = new SimpleFBAuth(server);
    }
    SimpleFBAuth.instance.connector = connector;
    SimpleFBAuth.instance.settings = settings;
    return SimpleFBAuth.instance;
  }

  private constructor(server: any) {
    server.use(restify.queryParser());    
    server.get(SimpleFBAuth.AuthStartPath + '/:userId', (req, res, next) => this.authStart(req, res, next));
    server.get(SimpleFBAuth.AuthCallbackPath, (req, res, next) => this.authCallback(req, res, next));
    server.get(SimpleFBAuth.AuthStartOAuthPath, (req, res, next) => this.authStartOAuth(req, res, next));
  }

  public botSignIn(session: builder.Session): void {
    let userId = session.message.address.user.id;
    let issueNewCard = () => {
      let authUrl = this.settings.baseUrl + SimpleFBAuth.AuthStartPath + '/' + userId;
      let card = new builder.SigninCard(session).text('Sign in Facebook app').button('Login', authUrl);
      let msg = new builder.Message(session).attachments([card]);
      session.send(msg);
      session.endDialog();        
    };
    
    if (this.userIdFacebookTokenCache[ userId ]) {
      // Use cached token
      let token = this.userIdFacebookTokenCache[ userId ];

      // Send a thumbnail card with user's FB profile
      this.CreateFBProfileCard(token, card => {
        if (card) {
          let msg = new builder.Message(session)
                   .text('Cached credential is found. Use cached token to fetch info.')
                   .attachments([card]);
          session.send(msg);
          session.endDialog();
        } else {
          // Token is invalid to fetch info (i.e., expired)
          issueNewCard();
        }
      });
    } else {
      // No token cached: issue a new Signin card
      issueNewCard();
    }
  }

  public botSignOut(session: builder.Session): void {
    let userId = session.message.address.user.id;    
    delete this.userIdFacebookTokenCache[ userId ];
    let msg = new builder.Message(session).text('Your cached credential has been removed.');
    session.send(msg);
    session.endDialog();
  }

  public verifySigninState(event: builder.IEvent, 
                           query: teams.ISigninStateVerificationQuery, 
                           callback: (err: Error, result: any, statusCode?: number) => void) {

    let sendMessage = (text?: string, card?: builder.AttachmentType) => {
      let msg = new builder.Message().address(event.address);
      if (text) {
        msg.text(text);
      }
      if (card) {
        msg.attachments([card]);
      }
      this.connector.send([msg.toMessage()], null);
    };

    // Decrypt state string to get code and original userId & channelId
    let state = this.decryptState(query.state);
    let trustableUserId = event.address.user.id;
    let trustableChannelId = event.sourceEvent.channel && event.sourceEvent.channel.id;
    let invalidUserId = state.userId !== trustableUserId;
    let invalidChannelId = state.channelId && trustableChannelId && state.channelId !== trustableChannelId;

    // Verify userId & channelId
    if (invalidUserId || invalidChannelId) {
      sendMessage('Unauthorized: User ID verification failed. Please try again.');
      callback(new Error('User ID verification failed'), null, 401);
      return;
    } else {
      // Prepare FB OAuth request
      let fbAppId = this.settings.fbAppClientId;
      let fbOAuthRedirectUrl = this.settings.baseUrl + SimpleFBAuth.AuthCallbackPath;
      let fbAppSecret = this.settings.fbAppClientSecret;
      let fbOAuthTokenUrl = 'https://graph.facebook.com/v2.10/oauth/access_token';
      let fbOAuthTokenParams = `?client_id=${fbAppId}&redirect_uri=${fbOAuthRedirectUrl}&client_secret=${fbAppSecret}&code=${state.accessCode}`;

      // Use access code to exchange FB token
      request.get(fbOAuthTokenUrl + fbOAuthTokenParams, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let tokenObj = JSON.parse(body);

          // Update cache
          let fbToken = tokenObj['access_token'];
          this.userIdFacebookTokenCache[ trustableUserId ] = fbToken;

          // Send a thumbnail card with user's FB profile
          this.CreateFBProfileCard(fbToken, card => {
            if (card) {
              sendMessage(null, card);
              callback(null, null, 200);
              return;
            } else {
              sendMessage('Could not fetch your facebook info. Please try again later.');
              callback(new Error('Facebook API call failed'), null, 500);
              return;                  
            }
          });
        } else {
          sendMessage('Facebook token update failed. Please try again later.');
          callback(new Error('Facebook token update failed'), null, 500);
          return;
        }
      });
    }
  }

  private authStart(req: any, res: any, next: Function) {
    let userId = req.params.userId;
    let authUrl = this.settings.baseUrl + SimpleFBAuth.AuthStartOAuthPath;
    let body = `
      <html>
        <head>
          <script src='${SimpleFBAuth.TeamsSDK}'></script>
        </head>
        <body>
          <script>
            microsoftTeams.initialize();
            microsoftTeams.getContext((context) => {
              //- Save user and channel id to cookie
              document.cookie = 'userId=' + '${userId}' + '; Path=/';
              if (context.channelId) {
                document.cookie = 'channelId=' + context.channelId + ';Path=/';
              } else {
                document.cookie = 'channelId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              }
              window.location = '${authUrl}';
            });        
          </script>
        </body>
      </html>
    `;

    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  }

  private authStartOAuth(req: any, res: any, next: Function) {
    let fbAppId = this.settings.fbAppClientId;
    let fbOAuthRedirectUrl = this.settings.baseUrl + SimpleFBAuth.AuthCallbackPath;
    let fbAppScope = this.settings.fbAppScope;
    let fbOAuthUrl = `https://www.facebook.com/v2.10/dialog/oauth?client_id=${fbAppId}&redirect_uri=${fbOAuthRedirectUrl}&scope=${fbAppScope}`;
    res.redirect(fbOAuthUrl, next);
  }

  private authCallback(req: any, res: any, next: Function) {
    let onAuthResultBody = (succeeded: boolean, state?: string) => { return succeeded ? `
      <html>
        <head>
          <script src='${SimpleFBAuth.TeamsSDK}'></script>        
        </head>
        <body>
          <script>
            microsoftTeams.initialize();
            microsoftTeams.authentication.notifySuccess('${state}');
          </script>
        </body>
      </html>
      ` : `
      <html>
        <head>
          <script src='${SimpleFBAuth.TeamsSDK}'></script>
        </head>
        <body>
          <script>
            microsoftTeams.initialize();
            microsoftTeams.authentication.notifyFailure();
          </script>
        </body>
      </html>
    `};

    let body: string = '';
    if (req.query.code) {
      let cookie = this.parseCookie(req.headers.cookie);
      let state = <ISigninState> {
        userId: cookie.userId,
        accessCode: req.query.code,
        channelId: cookie.channelId
      };
      body = onAuthResultBody(true, this.encryptState(state));
    } else {
      body = onAuthResultBody(false);
    }

    (<any> res).writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
  }

  private CreateFBProfileCard(fbToken: string, callback: Function) {
    // Use FB token to perform graph API to fetch user FB information
    let fbGraphUrl = (endPoint: string, params: string) => 'https://graph.facebook.com/' + endPoint + `?access_token=${fbToken}&` + params;
  
    request.get(fbGraphUrl('me', 'fields=name,id,email'), (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let fbUser = JSON.parse(body);
        request.get(fbGraphUrl(`${fbUser.id}/picture`, 'height=100'), (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let imgUrl = response.request.uri.href;
            let card = new builder.ThumbnailCard()
                      .title(fbUser.name)
                      .subtitle(fbUser.email)
                      .images([new builder.CardImage().url(imgUrl)]);
            callback(card);
          } else {
            callback(null);
          }
        });
      } else {
        callback(null);
      }
    });
  }

  private parseCookie(rawCookie: string): any {
    let cookies: any = {};
    if (rawCookie) {
      let c = rawCookie.split('; ');
      for (let i = c.length - 1; i >= 0; i--) {
        let v = c[i].split('=');
        cookies[ v[0] ] = v[1];
     }
    }
    return cookies;
  }

  private encryptState(state: ISigninState): string {
    const cipher = crypto.createCipher('aes192', this.settings.fbAppClientSecret);
    let encryptedState = cipher.update(JSON.stringify(state), 'utf8', 'base64');
    encryptedState += cipher.final('base64');
    return encryptedState;
  }

  private decryptState(rawState: string): ISigninState {
    const decipher = crypto.createDecipher('aes192', this.settings.fbAppClientSecret);
    let state = decipher.update(rawState, 'base64', 'utf8');
    state += decipher.final('utf8');
    let parsedState = JSON.parse(state);
    return parsedState;
  }
}

//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Teams: https://dev.office.com/microsoft-teams
//
// Bot Builder Microsoft Teams SDK GitHub
// https://github.com/OfficeDev/BotBuilder-MicrosoftTeams
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ''AS IS'', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//


import * as builder from 'botbuilder';
import * as teams from './';
import * as sprintf from 'sprintf-js';

export class O365ConnectorCard implements builder.IIsAttachment {
    protected data = {
        contentType: 'application/vnd.microsoft.teams.card.o365connector',
        content: <teams.IO365ConnectorCard> {}
    };
    
    constructor(protected session?: builder.Session) {
    }

    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            (<teams.IO365ConnectorCard>this.data.content).title = fmtText(this.session, text, args);
        } else {
            delete (<teams.IO365ConnectorCard>this.data.content).title;
        }
        return this;
    }

    public text(text: string|string[], ...args: any[]): this {
        if (text) {
            (<teams.IO365ConnectorCard>this.data.content).text = fmtText(this.session, text, args);
        } else {
            delete (<teams.IO365ConnectorCard>this.data.content).text;
        }
        return this;
    }

    public summary(text: string|string[], ...args: any[]): this {
        (<teams.IO365ConnectorCard>this.data.content).summary = text ? fmtText(this.session, text, args) : '';
        return this; 
    }

    public themeColor(color: string): this {
        if (color) {
            (<teams.IO365ConnectorCard>this.data.content).themeColor = color;
        } else {
            delete (<teams.IO365ConnectorCard>this.data.content).themeColor;
        }
        return this;
    }

    public sections(list: teams.IO365ConnectorCardSection[]|teams.IIsO365ConnectorCardSection[]): this {
        (<teams.IO365ConnectorCard>this.data.content).sections = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let section = list[i];
                (<teams.IO365ConnectorCard>this.data.content).sections.push((<teams.IIsO365ConnectorCardSection>section).toSection ? (<teams.IIsO365ConnectorCardSection>section).toSection() : <teams.IO365ConnectorCardSection>section);
            }
        }
        return this;
    }

    public potentialAction(list: teams.IO365ConnectorCardActionBase[]|teams.IIsO365ConnectorCardActionBase[]): this {
        (<teams.IO365ConnectorCard>this.data.content).potentialAction = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let action = list[i];
                let obj = (<teams.IIsO365ConnectorCardActionBase>action).toAction ?
                          (<teams.IIsO365ConnectorCardActionBase>action).toAction() : <teams.IO365ConnectorCardActionBase>action;
                (<teams.IO365ConnectorCard>this.data.content).potentialAction.push(o365ActionToPayload(obj));
            }
        }
        return this;
    }

    public toAttachment(): builder.IAttachment {
        return this.data;
    }
}

export enum O365ConnectorCardActivityImageTypes {
  Avatar,
  Article
}

export class O365ConnectorCardSection implements teams.IIsO365ConnectorCardSection {
    private data = <teams.IO365ConnectorCardSection>{};
    
    constructor(protected session?: builder.Session) {
    }

    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.title = fmtText(this.session, text, args);
        } else {
            delete this.data.title;
        }
        return this;
    }

    public text(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.text = fmtText(this.session, text, args);
        } else {
            delete this.data.text;
        }
        return this;
    }

    public activityTitle(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.activityTitle = fmtText(this.session, text, args);
        } else {
            delete this.data.activityTitle;
        }
        return this;
    }

    public activitySubtitle(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.activitySubtitle = fmtText(this.session, text, args);
        } else {
            delete this.data.activitySubtitle;
        }
        return this;
    }

    public activityText(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.activityText = fmtText(this.session, text, args);
        } else {
            delete this.data.activityText;
        }
        return this;
    }

    public activityImage(imageUrl: string): this {
        if (imageUrl) {
            this.data.activityImage = imageUrl;
            if (!this.data.activityImageType) {
                this.data.activityImageType = 'avatar';
            }
        } else {
            delete this.data.activityImage;
            delete this.data.activityImageType;
        }
        return this;
    }

    public activityImageType(imageType: O365ConnectorCardActivityImageTypes): this {
        if (imageType as O365ConnectorCardActivityImageTypes === O365ConnectorCardActivityImageTypes.Article) {
            this.data.activityImageType = 'article';
        } else {
            this.data.activityImageType = 'avatar';
        }
        return this;
    }

    public markdown(flag: boolean): this {
        this.data.markdown = !!flag;
        return this;
    }

    public facts(list: teams.IO365ConnectorCardFact[]|teams.IIsO365ConnectorCardFact[]): this {
        this.data.facts = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let fact = list[i];
                this.data.facts.push((<teams.IIsO365ConnectorCardFact>fact).toFact ? (<teams.IIsO365ConnectorCardFact>fact).toFact() : <teams.IO365ConnectorCardFact>fact);    
            }
        }
        return this;
    }

    public images(list: teams.IO365ConnectorCardImage[]|teams.IIsO365ConnectorCardImage[]): this {
        this.data.images = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let image = list[i];
                this.data.images.push((<teams.IIsO365ConnectorCardImage>image).toImage ? (<teams.IIsO365ConnectorCardImage>image).toImage() : <teams.IO365ConnectorCardImage>image);
            }
        }
        return this;
    }
    
    public potentialAction(list: teams.IO365ConnectorCardActionBase[]|teams.IIsO365ConnectorCardActionBase[]): this {
        this.data.potentialAction = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let action = list[i];
                let obj = (<teams.IIsO365ConnectorCardActionBase>action).toAction ?
                          (<teams.IIsO365ConnectorCardActionBase>action).toAction() : <teams.IO365ConnectorCardActionBase>action;
                this.data.potentialAction.push(o365ActionToPayload(obj));
            }
        }
        return this;
    }

    public toSection(): teams.IO365ConnectorCardSection {
        return this.data;
    }
}

export class O365ConnectorCardFact implements teams.IIsO365ConnectorCardFact {
    private data = <teams.IO365ConnectorCardFact>{ name: '' };
    
    constructor(private session?: builder.Session) {
        
    }
    
    public name(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.name = fmtText(this.session, text, args);
        } else {
            delete this.data.name;
        }
        return this;
    }

    public value(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.value = fmtText(this.session, text, args);
        } else {
            delete this.data.value;
        }
        return this;
    }
        
    public toFact(): teams.IO365ConnectorCardFact {
        return this.data;    
    }
}

export class O365ConnectorCardImage implements teams.IIsO365ConnectorCardImage {
    private data = <teams.IO365ConnectorCardImage>{};
    
    constructor(private session?: builder.Session) {
        
    }
    
    public image(url: string): this {
        if (url) {
            this.data.image = url;
        }
        return this;
    }
    
    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.title = fmtText(this.session, text, args);
        } else {
            delete this.data.title;
        }
        return this;
    }
    
    public toImage(): teams.IO365ConnectorCardImage {
        return this.data;    
    }
}

export abstract class O365ConnectorCardActionBase implements teams.IIsO365ConnectorCardActionBase {
    protected data = <teams.IO365ConnectorCardActionBase>{}
    
    constructor(protected session?: builder.Session) {
    }

    public name(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.name = fmtText(this.session, text, args);
        } else {
            delete this.data.name;
        }
        return this;
    }

    public id(actionId: string): this {
        if (actionId) {
            this.data.id = actionId;
        } else {
            delete this.data.id;
        }
        return this;
    }

    protected abstract get type(): string;

    public toAction(): teams.IO365ConnectorCardActionBase {
        this.data.type = this.type;
        return this.data;
    }
}

export class O365ConnectorCardViewAction extends O365ConnectorCardActionBase {
    constructor(protected session?: builder.Session) {
        super(session);
    }

    public target(targetUrl: string): this {
        (<teams.IO365ConnectorCardViewAction>this.data).target = targetUrl ? [targetUrl] : [];
        return this;
    }

    protected get type(): string {
        return 'ViewAction';
    }
}

export class O365ConnectorCardOpenUri extends O365ConnectorCardActionBase {
    private targetsData:  {[os in teams.O365ConnectorCardOpenUriOS]?: string} = {};

    constructor(protected session?: builder.Session) {
        super(session);
    }

    public targets(platformUrlMap: {[os in teams.O365ConnectorCardOpenUriOS]?: string}): this {
        if (platformUrlMap) {
            this.targetsData = platformUrlMap;
            this.update();
        }
        return this;
    }

    public default(targetUrl: string): this {
        if (targetUrl) {
            this.targetsData.default = targetUrl;
        } else {
            delete this.targetsData.default;
        }
        this.update();
        return this;
    }

    public iOS(targetUrl: string): this {
        if (targetUrl) {
            this.targetsData.iOS = targetUrl;
        } else {
            delete this.targetsData.iOS;
        }
        this.update();        
        return this;
    }

    public android(targetUrl: string): this {
        if (targetUrl) {
            this.targetsData.android = targetUrl;
        } else {
            delete this.targetsData.android;
        }
        this.update();
        return this;
    }

    public windowsPhone(targetUrl: string): this {
        if (targetUrl) {
            this.targetsData.windows = targetUrl;
        } else {
            delete this.targetsData.windows;
        }
        this.update();
        return this;
    }

    private update(): void {
        let data: teams.IO365ConnectorCardOpenUriTarget[] = [];
        for (let key in this.targetsData) {
            let val: string = this.targetsData[ <teams.O365ConnectorCardOpenUriOS>key ];
            if (val) {
                data.push(<teams.IO365ConnectorCardOpenUriTarget> {
                    os: key,
                    uri: val
                });
            }
        }
        (<teams.IO365ConnectorCardOpenUri>this.data).targets = data;
    }

    protected get type(): string {
        return 'OpenUri';
    }
}

export class O365ConnectorCardHttpPOST extends O365ConnectorCardActionBase {
    constructor(protected session?: builder.Session) {
        super(session);
    }

    public body(text: string): this {
        if (text) {
            (<teams.IO365ConnectorCardHttpPOST>this.data).body = text;
        } else {
            delete (<teams.IO365ConnectorCardHttpPOST>this.data).body;
        }
        return this;
    }

    protected get type(): string {
        return 'HttpPOST';
    }
}

export class O365ConnectorCardActionCard extends O365ConnectorCardActionBase {    
    constructor(protected session?: builder.Session) {
        super(session);
    }

    public actions(list: teams.IO365ConnectorCardActionBase[]|teams.IIsO365ConnectorCardActionBase[]): this {
        let data = <teams.IO365ConnectorCardActionCard> this.data;
        data.actions = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let action = list[i];
                let obj = (<teams.IIsO365ConnectorCardActionBase>action).toAction ?
                          (<teams.IIsO365ConnectorCardActionBase>action).toAction() : <teams.IO365ConnectorCardActionBase>action;                
                data.actions.push(o365ActionToPayload(obj));
            }
        }
        return this;
    }

    public inputs(list: teams.IO365ConnectorCardInputBase[]|teams.IIsO365ConnectorCardInputBase[]): this {
        let data = <teams.IO365ConnectorCardActionCard> this.data;
        data.inputs = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let input = list[i];
                let obj = (<teams.IIsO365ConnectorCardInputBase>input).toInput ?
                          (<teams.IIsO365ConnectorCardInputBase>input).toInput() : <teams.IO365ConnectorCardInputBase>input;
                data.inputs.push(o365InputToPayload(obj));
            }
        }
        return this;
    }

    protected get type(): string {
        return 'ActionCard';
    }    
}

export abstract class O365ConnectorCardInputBase implements teams.IIsO365ConnectorCardInputBase {
    protected data = <teams.IO365ConnectorCardInputBase>{};

    constructor(protected session?: builder.Session) {
    }

    public id(inputId: string): this {
        if (inputId) {
            this.data.id = inputId;
        } else {
            delete this.data.id;
        }
        return this;
    }

    public isRequired(flag: boolean): this {
        this.data.isRequired = !!flag;
        return this;
    }

    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.title = fmtText(this.session, text, args);
        } else {
            delete this.data.title;
        }
        return this;
    }

    public value(text: string): this {
        if (text) {
            this.data.value = text;
        } else {
            delete this.data.value;
        }
        return this;
    }

    protected abstract get type(): string;

    public toInput(): teams.IO365ConnectorCardInputBase {
        this.data.type = this.type;
        return this.data;
    }
}

export class O365ConnectorCardTextInput extends O365ConnectorCardInputBase {
    constructor(protected session?: builder.Session) {
        super(session);
    }

    public isMultiline(flag: boolean): this {
        (<teams.IO365ConnectorCardTextInput>this.data).isMultiline = !!flag;
        return this;
    }

    public maxLength(len: number): this {
        if (len && len > 0) {
            (<teams.IO365ConnectorCardTextInput>this.data).maxLength = len;
        } else {
            delete (<teams.IO365ConnectorCardTextInput>this.data).maxLength;
        }
        return this;
    }

    protected get type(): string {
        return 'textInput';
    }
}

export class O365ConnectorCardDateInput extends O365ConnectorCardInputBase {
    constructor(protected session?: builder.Session) {
        super(session);
    }

    public includeTime(flag: boolean): this {
        (<teams.IO365ConnectorCardDateInput>this.data).includeTime = !!flag;
        return this;
    }

    protected get type(): string {
        return 'dateInput';
    }
}

export class O365ConnectorCardMultichoiceInput extends O365ConnectorCardInputBase {
    constructor(protected session?: builder.Session) {
        super(session);
    }

    public isMultiSelect(flag: boolean): this {
        (<teams.IO365ConnectorCardMultichoiceInput>this.data).isMultiSelect = !!flag;
        return this;
    }

    public style(s: teams.O365ConnectorCardMultichoiceInputStyle): this {
        if (s) {
            (<teams.IO365ConnectorCardMultichoiceInput>this.data).style = s;
        } else {
            delete (<teams.IO365ConnectorCardMultichoiceInput>this.data).style;
        }
        return this;
    }

    public compactStyle(): this {
        (<teams.IO365ConnectorCardMultichoiceInput>this.data).style = 'compact';
        return this;
    }

    public expandedStyle(): this {
        (<teams.IO365ConnectorCardMultichoiceInput>this.data).style = 'expanded';
        return this;
    }

    public choices(list: teams.IO365ConnectorCardMultichoiceInputChoice[]|teams.IIsO365ConnectorCardMultichoiceInputChoice[]): this {
        let choicesData: teams.IO365ConnectorCardMultichoiceInputChoice[] = [];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if ((<teams.IIsO365ConnectorCardMultichoiceInputChoice>item).toChoice) {
                    choicesData.push((<teams.IIsO365ConnectorCardMultichoiceInputChoice>item).toChoice());
                 } else {
                    choicesData.push(<teams.IO365ConnectorCardMultichoiceInputChoice>item);
                 }    
            }
        }
        (<teams.IO365ConnectorCardMultichoiceInput>this.data).choices = choicesData;
        return this;
    }

    protected get type(): string {
        return 'multichoiceInput';
    }
}

export class O365ConnectorCardMultichoiceInputChoice implements teams.IIsO365ConnectorCardMultichoiceInputChoice{
    private data = <teams.IO365ConnectorCardMultichoiceInputChoice>{};

    constructor(protected session?: builder.Session) {
    }

    public display(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.display = fmtText(this.session, text, args);
        } else {
            delete this.data.display;
        }
        return this;
    }

    public value(text: string): this {
        if (text) {
            this.data.value = text;
        } else {
            delete this.data.value;
        }
        return this;
    }

    public toChoice(): teams.IO365ConnectorCardMultichoiceInputChoice {
        return this.data;
    }
}

export function fmtText(session: builder.Session, prompts: string|string[], args?: any[]): string {
    var fmt = builder.Message.randomPrompt(prompts);
    if (session) {
        // Run prompt through localizer
        fmt = session.gettext(fmt);
    }
    return args && args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt; 
}

export function o365ActionToPayload(obj: teams.IO365ConnectorCardActionBase): teams.IO365ConnectorCardActionBase{
    if (obj.type) {
        (<any> obj)['@type'] = obj.type;
        delete obj.type;
    }
    if (obj.id) {
        (<any> obj)['@id'] = obj.id;
        delete obj.id;
    }
    return obj;
}

export function o365InputToPayload(obj: teams.IO365ConnectorCardInputBase): teams.IO365ConnectorCardInputBase{
    if (obj.type) {
        (<any> obj)['@type'] = obj.type;
        delete obj.type;
    }
    return obj;
}
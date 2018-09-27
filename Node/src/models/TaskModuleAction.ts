import * as builder from 'botbuilder';
import { IIsAdaptiveCardBotBuilderAction, IAdaptiveCardAction, AdaptiveCardBotBuilderAction } from './AdaptiveCard';

export class TaskModuleCardAction implements IIsAdaptiveCardBotBuilderAction, builder.IIsCardAction {

  private adaptorObj: builder.CardAction;

  constructor(private session?: builder.Session) {
      this.adaptorObj = new builder.CardAction(session);
      this.adaptorObj.type('invoke');
  }

  /** Title of the action. For buttons this will be the label of the button.  For tap actions this may be used for accesibility purposes or shown on hover. */
  title(text: builder.TextType, ...args: any[]): TaskModuleCardAction {
      this.adaptorObj.title(text, ...args);
      return this;
  }

  /** The actions value. */
  value(v: {[key: string]: any}): TaskModuleCardAction {
      this.adaptorObj.value(<any> v);
      return this;
  }

  toAction(): builder.ICardAction {
      let json = this.adaptorObj.toAction();
      let valJson = (typeof json.value === 'string') ? JSON.parse(json.value) : json.value;
      valJson.type = 'task/fetch';
      json.value = JSON.stringify(valJson);
      return json;
  }

  toAdaptiveCardAction(): IAdaptiveCardAction {
      let btn: builder.ICardAction = this.toAction();
      let adapterBtn = AdaptiveCardBotBuilderAction.convertFromBotBuilderCardAction(btn);
      return adapterBtn;
  }
}

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

import * as builder from 'botbuilder';
import * as ac from 'adaptivecards';

export type IAdaptiveCardVersion = ac.IAdaptiveCard['version'];
export type IAdaptiveCardBackgroundImage = ac.IAdaptiveCard['backgroundImage'];
export type IAdaptiveCardBody = ac.IAdaptiveCard['body'];
export type IAdaptiveCardAction = ac.IAdaptiveCard['actions'][0];
export type IAdaptiveCardSpeak = ac.IAdaptiveCard['speak'];
export type IAdaptiveCardFallbackText = string;
export type IAdaptiveCardLang = string;

export interface IIsAdaptiveCard {
    toAdaptiveCard(): ac.IAdaptiveCard;
}

export interface IIsAdaptiveCardBotBuilderAction {
    toAdaptiveCardAction(): IAdaptiveCardAction;
}

export class AdaptiveCardBotBuilderAction implements IIsAdaptiveCardBotBuilderAction, builder.IIsCardAction {
    private static readonly TeamsActionWrapperName = 'msteams';

    public static convertFromBotBuilderCardAction(btn: builder.ICardAction): IAdaptiveCardAction {
        let adapterBtn: IAdaptiveCardAction = {
            id: undefined,
            type: 'Action.Submit',
            title: btn.title,
            data: {},
        };
        delete btn.title;
        adapterBtn.data[ AdaptiveCardBotBuilderAction.TeamsActionWrapperName ] = btn;
        return adapterBtn;
    }

    private adaptorObj: builder.CardAction;

    constructor(private sessionOrWrapAction?: builder.Session | builder.CardAction) {
        if (sessionOrWrapAction instanceof builder.CardAction) {
            this.adaptorObj = sessionOrWrapAction;
        } else {
            this.adaptorObj = new builder.CardAction(sessionOrWrapAction);
        }
    }

    /** Type of card action. */
    type(t: string): AdaptiveCardBotBuilderAction {
        this.adaptorObj.type(t);
        return this;
    }

    /** Title of the action. For buttons this will be the label of the button.  For tap actions this may be used for accesibility purposes or shown on hover. */
    title(text: builder.TextType, ...args: any[]): AdaptiveCardBotBuilderAction {
        this.adaptorObj.title(text, ...args);
        return this;
    }

    /** The actions value. */
    value(v: string): AdaptiveCardBotBuilderAction {
        this.adaptorObj.value(v);
        return this;
    }

    /** (Optional) Text for this action. */
    text(text: builder.TextType, ...args: any[]): AdaptiveCardBotBuilderAction {
        this.adaptorObj.text(text, ...args);
        return this;
    }

    /** (Optional) text to display in the chat feed if the button is clicked. */
    displayText(text: builder.TextType, ...args: any[]): AdaptiveCardBotBuilderAction {
        this.adaptorObj.displayText(text, ...args);
        return this;
    }

    toAction(): builder.ICardAction {
        return this.adaptorObj.toAction();
    }

    toAdaptiveCardAction(): IAdaptiveCardAction {
        let btn: builder.ICardAction = this.toAction();
        let adapterBtn = AdaptiveCardBotBuilderAction.convertFromBotBuilderCardAction(btn);
        return adapterBtn;
    }
}

/**
 * Adaptive card builder class.
 */
export class AdaptiveCard implements builder.IIsAttachment, IIsAdaptiveCard {
    public static readonly contentType = 'application/vnd.microsoft.card.adaptive';

    /** Internal card object being built. */
    private data: ac.IAdaptiveCard = {
        type: 'AdaptiveCard',
        version: '1.0'
    };
        
    /** Creates a new adaptive card builder. */
    constructor(private session?: builder.Session) {
    }   

    public get type(): 'AdaptiveCard' {
        return this.data.type;
    }   

    public version(value: IAdaptiveCardVersion): this {
        this.data.version = value;
        return this;
    }

    public backgroundImage(value: IAdaptiveCardBackgroundImage): this {
        this.data.backgroundImage = value;
        return this;
    }

    public body(value: IAdaptiveCardBody): this {
        this.data.body = value;
        return this;
    }

    public speak(value: IAdaptiveCardSpeak): this {
        this.data.speak = value;
        return this;
    }

    public fallbackText(value: IAdaptiveCardFallbackText): this {
        this.data.fallbackText = value;
        return this;
    }

    public lang(value: IAdaptiveCardLang): this {
        this.data.lang = value;
        return this;
    }

    public actions(list: (builder.CardAction | builder.IIsCardAction | IAdaptiveCardAction | IIsAdaptiveCardBotBuilderAction)[]): this {
        this.data.actions = [];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var action = list[i];
                let isBotBuilderAction = (list instanceof builder.CardAction) || (<builder.IIsCardAction>action).toAction;
                if (isBotBuilderAction) {
                    let btn: any = (<builder.IIsCardAction>action).toAction ? (<builder.IIsCardAction>action).toAction() : action;
                    let adapterBtn = AdaptiveCardBotBuilderAction.convertFromBotBuilderCardAction(btn);
                    this.data.actions.push(adapterBtn);
                } else {
                    if ((<IIsAdaptiveCardBotBuilderAction>action).toAdaptiveCardAction) {
                        this.data.actions.push((<IIsAdaptiveCardBotBuilderAction>action).toAdaptiveCardAction());
                    } else {
                        this.data.actions.push(<IAdaptiveCardAction>action);
                    }
                }
            }
        }
        return this;
    }

    public toAdaptiveCard(): ac.IAdaptiveCard {
        return this.data;
    }

    /** Returns the JSON object for the attachment. */
    public toAttachment(): builder.IAttachment {
        let cardAttachment: builder.IAttachment = {
            contentType: AdaptiveCard.contentType,
            content: this.toAdaptiveCard()
        };
        return cardAttachment;
    }
}

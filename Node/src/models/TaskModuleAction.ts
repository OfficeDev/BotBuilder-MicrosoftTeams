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

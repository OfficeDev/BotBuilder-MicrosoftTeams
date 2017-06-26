// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Bot Framework: http://botframework.com
// 
// Bot Builder SDK Github:
// https://github.com/Microsoft/BotBuilder
// 
// Copyright (c) Microsoft Corporation
// All rights reserved.
// 
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import * as builder from "botbuilder";

// Strip bot mentions from the message text
export class StripBotAtMentions implements builder.IMiddlewareMap {

    public readonly botbuilder = (session: builder.Session, next: Function): void => {
        let message = session.message;
        if (message) {
            let botMri = message.address.bot.id.toLowerCase();
            let botAtMentions = message.entities && message.entities.filter(
                (entity) => (entity.type === "mention") && (entity.mentioned.id.toLowerCase() === botMri));
            if (botAtMentions && botAtMentions.length) {
                // Save original text as property of the message
                (message as any).textWithBotMentions = message.text;
                // Remove the text corresponding to each mention
                message.text = botAtMentions.reduce((previousText, entity) => {
                    return previousText.replace(entity.text, "").trim();
                }, message.text);
            }
        }
        next();
    }

}

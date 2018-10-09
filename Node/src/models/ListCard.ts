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

import * as builder from 'botbuilder';
import { fmtText } from './o365ConnectorCard';

/**
 * List card builder class.
 */
export class ListCard implements builder.IIsAttachment {

    /** Internal attachment object being built. */
    private data: builder.IAttachment = {
        contentType: 'application/vnd.microsoft.teams.card.list',
        content: { }
    };

    /** Creates a new list card builder. */
    constructor(private session?: builder.Session) {
    }

    /** Card title. */
    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.content.title = fmtText(this.session, text, args);
        } else {
            delete this.data.content.title;
        }
        return this;
    }

    /** Card items. */
    public items(list: (IListCardItem|IIsListCardItem)[]): this {
        const items = (list || []).map(ListCard.toListItem);
        this.data.content.items = items;
        return this;
    }

    /** 
     * Adds an item to the list. 
     * @param item The list item to add.
     */
    public addItem(item: IListCardItem|IIsListCardItem): this {
        const listItem = ListCard.toListItem(item);
        if (this.data.content.items) {
            let listItems: IListCardItem[] = this.data.content.items;
            listItems.push(listItem);
        } else {
            this.data.content.items = [ listItem ];
        }
        return this;
    }

    /** Card buttons. */
    public buttons(list: (builder.ICardAction|builder.IIsCardAction)[]): this {
        const buttons = (list || []).map(button => {
            return ((button as builder.IIsCardAction).toAction) ? 
                (button as builder.IIsCardAction).toAction() :
                (button as builder.ICardAction);
        });
        this.data.content.buttons = buttons;
        return this;
    }

    /** Returns the JSON object for the attachment. */
    public toAttachment(): builder.IAttachment {
        return this.data;
    }

    private static toListItem(item: IListCardItem|IIsListCardItem): IListCardItem {
        return ((item as IIsListCardItem).toItem) ? 
        (item as IIsListCardItem).toItem() :
        (item as IListCardItem);
    }
}

/**
 * List card item builder class.
 */
export class ListCardItem implements IIsListCardItem {

    /** Internal object being built. */
    private data: IListCardItem = {
        type: ListCardItemType.resultItem,
    }

    /** Creates a new list card item builder. */
    constructor(private session?: builder.Session) {
    }

    /** The type of the list item. Defaults to resultItem. */
    public type(type: ListCardItemType): this {
        this.data.type = type;
        return this;
    }

    /** List item title. Applies to items of type: resultItem. */
    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.title = fmtText(this.session, text, args);
        } else {
            delete this.data.title;
        }
        return this;
    }

    /** List item subtitle. Applies to items of type: resultItem. */
    public subtitle(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.subtitle = fmtText(this.session, text, args);
        } else {
            delete this.data.subtitle;
        }
        return this;
    }

    /** List item icon url. Applies to items of type: resultItem. */
    public icon(url: string): this {
        this.data.icon = url;
        return this;
    }

    /** Action to execute when the item is tapped. Applies to items of type: resultItem. */
    public tap(action: builder.ICardAction|builder.IIsCardAction): this {
        if (action) {
            this.data.tap = (action as builder.IIsCardAction).toAction ?
                (action as builder.IIsCardAction).toAction() :
                (action as builder.ICardAction);
        } else {
            delete this.data.tap;
        }
        return this;
    }

    /** Returns the JSON for the item */
    public toItem(): IListCardItem {
        return this.data;
    }
}

/**
 * List card item types.
 */
export enum ListCardItemType {
    /** Generic result item */
    resultItem = 'resultItem',

    /** List separator */
    separator = 'separator',
}

/**
 * Interface for a list card item.
 */
export interface IListCardItem {

    /** Type of the list item */
    type: ListCardItemType;

    /** List item id */
    id?: string;

    /** List item title */
    title?: string;

    /** List item subtitle */
    subtitle?: string;

    /** List item icon url */
    icon?: string;

    /** List item tap action */
    tap?: builder.ICardAction;
}

/**
 * Interface for a type convertible to a list card item.
 */
export interface IIsListCardItem {
    /** Returns the JSON for the item */
    toItem(): IListCardItem;
}

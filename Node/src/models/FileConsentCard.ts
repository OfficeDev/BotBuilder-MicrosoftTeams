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

import * as builder from "botbuilder";

/**
 * File consent card builder class.
 */
export class FileConsentCard implements builder.IIsAttachment {

    /** Internal attachment object being built. */
    private data: builder.IAttachment = {
        contentType: "application/vnd.microsoft.teams.card.file.consent",
        content: { }
    };

    /** Creates a new file consent card builder. */
    constructor(private session?: builder.Session) {
    }

    /** Name of the file. */
    public name(name: string): FileConsentCard {
        this.data.name = name;
        return this;
    }

    /** Description of the file. */
    public description(description: string, ...args: any[]): FileConsentCard {
        if (this.session) {
            description = this.session.gettext(description, args);
        }
        this.data.content.description = description;
        return this;
    }

    /** Approximate size of the file in bytes. */
    public sizeInBytes(sizeInBytes: number): FileConsentCard {
        if (sizeInBytes < 0) {
            throw new Error("sizeInBytes must be greater than or equal to 0.");
        }
        this.data.content.sizeInBytes = sizeInBytes;
        return this;
    }

    /** Context to return if the user accepts the proposed file upload. */
    public acceptContext(context: any): FileConsentCard {
        this.data.content.acceptContext = context;
        return this;
    }

    /** Context to return if the user declines the proposed file upload. */
    public declineContext(context: any): FileConsentCard {
        this.data.content.declineContext = context;
        return this;
    }

    /** 
     * Context to return whether the user accepts or declines the proposed file upload. 
     * Shorthand for calls to `acceptContext(context)` and `declineContext(context)` with the same value.
     */
    public context(context: any): FileConsentCard {
        this.data.content.acceptContext = context;
        this.data.content.declineContext = context;
        return this;
    }

    /** Returns the JSON object for the attachment. */
    toAttachment(): builder.IAttachment {
        return this.data;
    }
}
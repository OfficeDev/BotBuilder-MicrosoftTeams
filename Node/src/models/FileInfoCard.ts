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
import { IFileUploadInfo } from "./FileConsentCardResponse";

/**
 * File info card builder class.
 */
export class FileInfoCard implements builder.IIsAttachment {

    /** Internal attachment object being built. */
    private data: builder.IAttachment = {
        contentType: "application/vnd.microsoft.teams.card.file.info",
        content: { }
    };

    /** Creates a new file info card builder. */
    constructor(private session?: builder.Session) {
    }

    /** Name of the file. */
    public name(name: string): FileInfoCard {
        this.data.name = name;
        return this;
    }

    /** URL to the file. */
    public contentUrl(url: string): FileInfoCard {
        this.data.contentUrl = url;
        return this;
    }

    /** Unique ID of the file. */
    public uniqueId(uniqueId: string): FileInfoCard {
        this.data.content.uniqueId = uniqueId;
        return this;
    }

    /** Type of the file. */
    public fileType(fileType: string): FileInfoCard {
        this.data.content.fileType = fileType;
        return this;
    }

    /** Returns the JSON object for the attachment. */
    toAttachment(): builder.IAttachment {
        return this.data;
    }

    /**
     * Creates a file info card from the data in a `IFileUploadInfo` object. 
     * @param uploadInfo The object containing the information that should be used to populate the card.
     */
    public static fromFileUploadInfo(uploadInfo: IFileUploadInfo): FileInfoCard {
        return new FileInfoCard()
            .name(uploadInfo.name)
            .contentUrl(uploadInfo.contentUrl)
            .uniqueId(uploadInfo.uniqueId)
            .fileType(uploadInfo.fileType);
    }
}
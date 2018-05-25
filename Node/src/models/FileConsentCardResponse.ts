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

/** Name of the file consent invoke activity */
export const fileConsentInvokeName = "fileConsent/invoke";

/** Represents the value of the invoke activity sent when the user acts on a file consent card. */
export interface IFileConsentCardResponse {

    /** The action the user took. */
    action: FileConsentCardAction;

    /** The context associated with the action. */
    context?: any;

    /** If the user accepted the file, contains information about the file to be uploaded. */
    uploadInfo?: IFileUploadInfo;
}

/** Actions the user can take on the file consent card. */
export enum FileConsentCardAction {

    /** File was accepted. */
    accept = "accept",

    /** File was declined. */
    decline = "decline",
}

/** Information about the file to be uploaded. */
export interface IFileUploadInfo {

    /** Name of the file. */
    name: string;

    /** URL to an upload session that the bot can use to set the file contents. */
    uploadUrl: string;

    /** URL to file. */
    contentUrl: string;

    /** ID that uniquely identifies the file. */
    uniqueId: string;

    /** Type of the file. */
    fileType: string;
}

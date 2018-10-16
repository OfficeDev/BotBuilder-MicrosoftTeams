import * as builder from 'botbuilder';
import * as ac from 'adaptivecards';
import { AdaptiveCard } from './AdaptiveCard';

export const taskModuleInvokeNameOfFetch = "task/fetch";

export const taskModuleInvokeNameOfSubmit = "task/submit";

export interface ITaskModuleInvokeRequest {
  data?: {[key: string]: any};
  context?: {
    theme: string;
  };
}

export interface ITaskModuleResponse {
  task: ITaskModuleResponseTaskObject;
}

export interface ITaskModuleResponseOfFetch extends ITaskModuleResponse {
  task: ITaskModuleContinueResponse;
}

export type ITaskModuleResponseOfSubmit = ITaskModuleResponse;

export type ITaskModuleResponseType = 'message' | 'cardResult' | 'continue';

export interface ITaskModuleResponseTaskObject {
  type: ITaskModuleResponseType;
}

export interface ITaskModuleMessageResponse extends ITaskModuleResponseTaskObject {
  type: 'message';
  value: string;
}

export interface ITaskModuleCardResultResponse extends ITaskModuleResponseTaskObject {
  type: 'cardResult';
  attachments?: [builder.IAttachment];
}

export interface ITaskModuleContinueResponse extends ITaskModuleResponseTaskObject {
  type: 'continue';
  value: ITaskModuleTaskInfo;
}

export type TaskModuleDimension = 'small' | 'medium' | 'large';

export interface ITaskModuleTaskInfo {
  url?: string;
  card?: builder.IAttachment;
  height?: number | TaskModuleDimension;
  width?: number | TaskModuleDimension;
  fallbackUrl?: string;
  title?: string;
}

export interface IIsTaskModuleResponseOfFetch {
  toResponseOfFetch(): ITaskModuleResponseOfFetch;
}

export interface IIsTaskModuleResponseOfSubmit {
  toResponseOfSubmit(): ITaskModuleResponseOfSubmit;
}

export class TaskModuleResponseOfSubmit {
  public continue(): TaskModuleContinueResponse {
    return new TaskModuleContinueResponse();
  }

  public message(): TaskModuleMessageResponse {
    return new TaskModuleMessageResponse();
  }

  public cardResult(): TaskModuleCardResultResponse {
    return new TaskModuleCardResultResponse();
  }
}

export abstract class TaskModuleResponse<T extends ITaskModuleResponseTaskObject> implements IIsTaskModuleResponseOfSubmit {

  public static createResponseOfFetch(): TaskModuleContinueResponse {
    return new TaskModuleContinueResponse();
  }

  public static createResponseOfSubmit(): TaskModuleResponseOfSubmit {
    return new TaskModuleResponseOfSubmit();
  }

  public toResponseOfSubmit(): ITaskModuleResponseOfSubmit {
    const data: ITaskModuleResponseOfSubmit = {
      task: this.getTaskObject()
    };
    return data;
  }

  protected abstract getTaskObject(): T;
}

export class TaskModuleContinueResponse extends TaskModuleResponse<ITaskModuleContinueResponse> implements IIsTaskModuleResponseOfFetch {

  private data: ITaskModuleTaskInfo = {};

  public url(url: string): this {
    if (this.data.card) {
      throw new Error(`'url' can not be assigned due to 'card' already assigned beforehand. It is not allowed to have both URL and card as contents.`);
    } else {
      this.data.url = url;
    }
    return this;
  }

  public card(card: AdaptiveCard | ac.IAdaptiveCard | builder.IAttachment): this {
    if (this.data.url) {
      throw new Error(`'card' can not be assigned due to 'url' already assigned beforehand. It is not allowed to have both URL and card as contents.`);
    } else {
      this.data.card = TaskModuleHelper.cardToAttachment(card);
    }
    return this;
  }

  public height(val: number | TaskModuleDimension): this {
    this.data.height = val;
    return this;
  }

  public width(val: number | TaskModuleDimension): this {
    this.data.width = val;
    return this;
  }

  public fallbackUrl(url: string): this {
    this.data.fallbackUrl = url;
    return this;
  }

  public title(title: string): this {
    this.data.title = title;
    return this;
  }

  public toResponseOfFetch(): ITaskModuleResponseOfFetch {
    const data: ITaskModuleResponseOfFetch = {
      task: this.getTaskObject()
    };
    return data;
  }

  protected getTaskObject(): ITaskModuleContinueResponse {
    return {
      type: 'continue',
      value: this.data
    }
  }
}

export class TaskModuleMessageResponse extends TaskModuleResponse<ITaskModuleMessageResponse> {

  private data: ITaskModuleMessageResponse = {
    type: 'message',
    value: ''
  };

  public text(text: string): this {
    this.data.value = text;
    return this;
  }

  protected getTaskObject(): ITaskModuleMessageResponse {
    return this.data;
  }
}

export class TaskModuleCardResultResponse extends TaskModuleResponse<ITaskModuleCardResultResponse> {

  private data: builder.IAttachment;

  constructor() {
    super();
    this.data = new AdaptiveCard().toAttachment();
  }

  public card(card: AdaptiveCard | ac.IAdaptiveCard | builder.IAttachment): this {
    this.data = TaskModuleHelper.cardToAttachment(card);
    return this;
  }

  protected getTaskObject(): ITaskModuleCardResultResponse {
    return {
      type: 'cardResult',
      attachments: [this.data]
    };
  }
}

class TaskModuleHelper {
  public static cardToAttachment(card: AdaptiveCard | ac.IAdaptiveCard | builder.IAttachment): builder.IAttachment {
    let data: builder.IAttachment;

    if (card instanceof AdaptiveCard) {
      data = card.toAttachment();
    } else if ((card as builder.IAttachment).contentType) {
      const attachment = card as builder.IAttachment;
      if ( attachment.contentType.toLowerCase() === AdaptiveCard.contentType.toLowerCase()) {
        data = attachment;
      } else {
        throw new Error('Invalid attachment content. Only adaptive card is acceptable.');
      }      
    } else {
      data = {
        contentType: AdaptiveCard.contentType,
        content: card
      }
    }

    return data;
  }
}
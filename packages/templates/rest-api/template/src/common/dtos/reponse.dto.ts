import { SuccessMessages } from "../enums/success-messages.enum";

export class ResponseDto {
    status: string;
    message: SuccessMessages;
    data?: {[key: string]: any};
    constructor(message: SuccessMessages, data?: {[key: string]: any}) {
        this.status = "SUCCESS";
        this.message = message;
        this.data = data;
    }
}
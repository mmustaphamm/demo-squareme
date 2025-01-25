import Constant from "../../constant";
import BaseError from "./BaserError";

class BadRequestError extends BaseError {
    name: string;
    statusCode: number;
    message: string;
    data: object;
    constructor(msg: string, data: object = {}) {
        super(msg, data);
        Object.setPrototypeOf(this, BadRequestError.prototype);
        this.name = Constant.errorName.badRequest;
        this.statusCode = Constant.statusCode.BAD_REQUEST;
        this.message = msg;
        this.data = data;
    }
}

export default BadRequestError;

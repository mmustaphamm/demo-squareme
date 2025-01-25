class BaseError extends Error {
    data: object;
    constructor(msg: string, data: object = {}) {
        super(msg);
        Object.setPrototypeOf(this, BaseError.prototype);
        Error.captureStackTrace(this, BaseError);
    }
}

export default BaseError;

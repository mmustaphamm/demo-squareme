import { Request, Response, NextFunction } from "express";
import ApplicationError from "../loader/error-handler/ApplicationError";
import BadRequestError from "../loader/error-handler/BadRequestError";
import ForbiddenError from "../loader/error-handler/ForbiddenError";
import NotAuthorizeError from "../loader/error-handler/NotAuthorizeError";
import ErrorAlert from "../loader/monitoring/ErrorAlert";
import response, { IBody } from "../loader/lib/http-response";
import fileLogger from "../loader/logging/error";
import Constant from "../constant";

type ErrorType =
    | ApplicationError
    | BadRequestError
    | NotAuthorizeError
    | ForbiddenError;

const errorHandler = (
    err: ErrorType,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorAlert = new ErrorAlert(err.message, err.name);
    errorAlert.notify();
    
    const errorMessage = `${req.ip} : ${req.method} ${req.url} ${err.statusCode} :${err.name} ${err.message} `;

    

    fileLogger.log({
        message: errorMessage,
        level: "error"
    });

    const { message } = err;
    const body: IBody = {
        message: message,
        statusCode: err.statusCode ? err.statusCode : 500,
        data: {} , 
        success : false
    };

    if (err instanceof ApplicationError) {
        body.message = Constant.messages.serverError;
        response(res,  body);
    } else {
        response(res,  body);
    }
};

export default errorHandler;

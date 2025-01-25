
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../loader/error-handler/BadRequestError";

export const validateBvn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { phoneNumber } = req.body
        const Schema = Joi.object({
            phoneNumber: Joi.string().length(13).pattern(/^[0-9]+$/).required(),
        });
        await Schema.validateAsync({
           phoneNumber
        });
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message))
    }
};

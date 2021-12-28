import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (ifIsNot: (res: Response, req: Request, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        //@ts-ignore
        req.session.isLoggedIn ? next() : ifIsNot(res, req, next);
    };
}
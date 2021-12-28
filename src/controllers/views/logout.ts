import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    //@ts-ignore
    req.session.isLoggedIn = false;
    res.redirect("/login");
}
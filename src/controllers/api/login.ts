import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    let { username, password } = req.body;
    if (username === process.env.APP_USERNAME && password === process.env.APP_PASSWORD) {
        //@ts-ignore
        req.session.isLoggedIn = true;
        res.status(200).json({});
    } else {
        res.status(401).json({
            message: "Wrong credentials"
        });
    }
}
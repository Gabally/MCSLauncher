import { Request, Response } from "express";
import { getInstanceStatus } from "../../instances";

export default (req: Request, res: Response) => {
    try {
        res.render("instance", { instance: getInstanceStatus(req.params.instanceName) });
    } catch(e) {
        res.sendStatus(404);
    }
}
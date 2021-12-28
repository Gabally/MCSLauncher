import { Request, Response } from "express";
import { getInstanceConfig } from "../../instances";

export default (req: Request, res: Response) => {
    try {
        res.render("editconfig", { config: getInstanceConfig(req.params.instanceName), name: req.params.instanceName });
    } catch (e) {
        res.sendStatus(404);
    }
}
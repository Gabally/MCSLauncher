import { Request, Response } from "express";
import { getInstancesStatus } from "../../instances";

export default (req: Request, res: Response) => {
    res.render("instances", {
        instances: getInstancesStatus()
    });
}
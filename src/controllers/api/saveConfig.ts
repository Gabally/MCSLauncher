import { Request, Response } from "express";
import { saveInstanceConfig } from "../../instances";

export default (req: Request, res: Response) => {
    let { config } = req.body;
    try {
        saveInstanceConfig(req.params.instanceName, config);
        res.status(200).json({});
    } catch(e: any) {
        res.status(500).json({
            message: e
        });
    }
}
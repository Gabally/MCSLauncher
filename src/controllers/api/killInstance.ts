import { Request, Response } from "express";
import { killInstance } from "../../instanceProcesses";

export default async (req: Request, res: Response) => {
    try {
        killInstance(req.params.instanceName);
        res.status(200).json({});
    } catch(e: any) {
        res.status(400).json({
            message: e
        });
    }
}
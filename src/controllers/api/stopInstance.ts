import { Request, Response } from "express";
import { stopInstance } from "../../instanceProcesses";

export default async (req: Request, res: Response) => {
    try {
        stopInstance(req.params.instanceName);
        res.status(200).json({});
    } catch(e: any) {
        res.status(400).json({
            message: e
        });
    }
}
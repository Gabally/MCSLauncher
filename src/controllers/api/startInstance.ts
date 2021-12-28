import { Request, Response } from "express";
import { broadCastChange, broadCastOutput } from "../../console";
import { startInstance } from "../../instanceProcesses";

export default async (req: Request, res: Response) => {
    try {
        startInstance(req.params.instanceName,
        () => {
            broadCastChange(req.params.instanceName);
        },
        (d) => {
            broadCastOutput(req.params.instanceName, d.toString());
        },
        () => {
            broadCastChange(req.params.instanceName);
        });
        res.status(200).json({});
    } catch(e: any) {
        console.error(e);
        res.status(400).json({
            message: e
        });
    }
}
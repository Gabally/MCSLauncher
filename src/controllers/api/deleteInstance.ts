import { Request, Response } from "express";
import { deleteInstance } from "../../instances";

export default async (req: Request, res: Response) => {
    try {
        deleteInstance(req.params.instanceName);
        res.status(200).json({});
    } catch(e: any) {
        res.status(400).json({
            message: e
        });
    }
}
import { Request, Response } from "express";
import { createNewInstance, deleteInstance, instanceNameExists } from "../../instances";
import { fetchServerDownload } from "../../utils";

export default async (req: Request, res: Response) => {
    let { name, version, maxRam  } = req.body;
    let serverDownload = await fetchServerDownload(version);
    if (instanceNameExists(name)) {
        res.status(400).json({
            message: "An instance with that name already exists"
        });
    } else if (!serverDownload) {
        res.status(500).json({
            message: "Unable to download the server for the selected version"
        });
    } else if (isNaN(parseInt(maxRam)) || parseInt(maxRam) > parseInt(process.env.MAX_RAM || "2")) {
        res.status(400).json({
            message: "The amount of ram you have selected is invalid"
        });
    }else {
        try {
            await createNewInstance(name, version, serverDownload, maxRam, req.file?.buffer);
            res.status(200).json({});
        } catch(e: any) {
            try {deleteInstance(name)} catch(e) {console.error(e);}
            res.status(400).json({
                message: e
            });
        }
    }
}
import { Request, Response } from "express";
import { fetchMinecraftVersions } from "../../utils";

export default async (req: Request, res: Response) => {
    let mcVersions = await fetchMinecraftVersions();
    res.render("newinstance", { 
        versions: mcVersions,
        minRam: parseInt(process.env.MIN_RAM || "1"),
        maxRam: parseInt(process.env.MAX_RAM || "3")
    });
}
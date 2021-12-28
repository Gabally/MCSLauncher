import https from "https";
import fs from  "fs";
import { default as AdmZip } from "adm-zip";
import path from "path";

export const fetchJSON = async (url: string) => {
    return new Promise<any>((resolve, reject) => {
        https.get(url, (resp) => {
            let data: string = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
    
            resp.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
};

export const fetchMinecraftVersions = async (): Promise<string[]> => {
    let versionsManifest = await fetchJSON("https://launchermeta.mojang.com/mc/game/version_manifest.json");
    return versionsManifest.versions.map((version: any) => version.id);
};

export const fetchServerDownload = async (version: string): Promise<string | undefined> => {
    try {
        let versionsManifest = await fetchJSON("https://launchermeta.mojang.com/mc/game/version_manifest.json");
        let versionInfo = versionsManifest.versions.find((v: any) => v.id === version);
        if (versionInfo) {
            let versionManifest = await fetchJSON(versionInfo.url);
            return versionManifest.downloads.server.url;
        } else {
            return undefined;
        }
    } catch(e) {
        return undefined;
    }
}

export const downloadFile = async (url: string, path: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(path);
        https.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
                file.close((err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve();
                    }
                });
              });
            response.on("error", (err) => {
                reject(err);
            });
        });
    });
};

export const extractMinecraftWorld = (file: Buffer, savePath: string) => {
    let zip = new AdmZip(file);
    let zipEntries = zip.getEntries();
    let worldPath = "";
    zipEntries.forEach((zipEntry) => {
        if (zipEntry.name === "level.dat") {
            worldPath = path.dirname(zipEntry.entryName);
        }
    });
    if (!worldPath) {
        throw "No world found inside the zip file";
    } else {
        zipEntries.forEach((zipEntry) => {
            if (zipEntry.entryName.startsWith(worldPath) && !zipEntry.isDirectory) {
                zip.extractEntryTo(zipEntry.entryName, path.dirname(path.join(savePath, "world", zipEntry.entryName.replace(worldPath, ""))), false, true);
            }
        });
    }
};

export const getFormattedDate = () => {
    let date = new Date();
    let str = `${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return str;
};

export const randomString = (length: number): string => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
   }
   return result;
}
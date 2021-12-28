import fs from "fs";
import path from "path";
import { isInstanceRunning } from "./instanceProcesses";
import { Instance } from "./types";
import { downloadFile, extractMinecraftWorld } from "./utils";

const instancesPath = process.env.INSTANCES_PATH ||  path.join(__dirname, "instances");

const checkForDir = (): void => {
    if (!fs.existsSync(instancesPath)) {
        fs.mkdirSync(instancesPath);
    }
};

const getServerPort = (instancePath: string): number | undefined => {
    if (!fs.existsSync(path.join(instancePath, "server.properties"))) {
        return undefined;
    }
    let port = fs.readFileSync(path.join(instancePath, "server.properties"), "utf8").split("\n").find(x => x.includes("server-port="));
    return port ? parseInt(port.replace("server-port=", "")) : undefined;
};

export const getInstancesStatus = (): Instance[] => {
    checkForDir();
    return fs.readdirSync(instancesPath)
    .filter((instance: string) => { return fs.statSync(path.join(instancesPath,instance)).isDirectory() && fs.existsSync(path.join(instancesPath,instance,"instance.json")) })
    .map((instance: string) => {
        let currentInstancePath = path.join(instancesPath,instance);
        let instanceConfig = JSON.parse(fs.readFileSync(path.join(currentInstancePath,"instance.json"), "utf8"));
        return {
            name: instance,
            online: isInstanceRunning(instance),
            port: getServerPort(currentInstancePath),
            version: instanceConfig.version
        }
    });
};

export const getInstanceStatus = (instanceName: string): Instance => {
    checkForDir();
    let currentInstancePath = getInstancePath(instanceName);
    if (fs.existsSync(currentInstancePath) && fs.statSync(currentInstancePath).isDirectory() && fs.existsSync(path.join(currentInstancePath, "instance.json"))) {
        let instanceConfig = JSON.parse(fs.readFileSync(path.join(currentInstancePath,"instance.json"), "utf8"));
        return {
            name: instanceName,
            online: isInstanceRunning(instanceName),
            port: getServerPort(currentInstancePath),
            version: instanceConfig.version
        }
    } else {
        throw "Instance does not exist";
    }
};

export const getInstanceInfo = (instanceName: string) => {
    try {
        getInstanceStatus(instanceName);
        let confPath = path.join(getInstancePath(instanceName),"instance.json");
        if (fs.existsSync(confPath)) {
            return JSON.parse(fs.readFileSync(confPath, "utf8"));
        } else {
            return {};
        }
    } catch(e) {
        throw "Could not get the instance configuration";
    }
};

export const getInstanceConfig = (instanceName: string): string => {
    try {
        getInstanceStatus(instanceName);
        let confPath = path.join(getInstancePath(instanceName),"server.properties");
        if (fs.existsSync(confPath)) {
            return fs.readFileSync(confPath, "utf8");
        } else {
            return "";
        }
    } catch(e) {
        throw "Could not get the instance configuration";
    }
};

export const saveInstanceConfig = (instanceName: string, config: string): void => {
    try {
        getInstanceStatus(instanceName);
        let confPath = path.join(getInstancePath(instanceName),"server.properties");
        fs.writeFileSync(confPath, config);
    } catch(e) {
        throw "Could not save the instance configuration";
    }
};

export const instanceNameExists = (instanceName: string): boolean => {
    checkForDir();
    return fs.existsSync(getInstancePath(instanceName));
};

export const createNewInstance = async (instanceName: string, version: string, serverURL: string, maxRam: number, world: Buffer | undefined): Promise<void> => {
    checkForDir();
    let newPath = getInstancePath(instanceName);
    try {
        fs.mkdirSync(newPath);
    } catch(e) {
        throw "Unable to create instance directory";
    }
    try {
        fs.writeFileSync(path.join(newPath, "eula.txt"), "eula=true");
    } catch(e) {
        throw "Unable to create eula file";
    }
    try {
        await downloadFile(serverURL, path.join(newPath, "server.jar"));
    } catch(e) {
        throw "Unable to download server jar";
    }
    try {
        fs.writeFileSync(path.join(newPath, "instance.json"), JSON.stringify({
            name: instanceName,
            version: version,
            maxRam: maxRam
        }));
    } catch(e) {
        throw "Unable to save instance configuraiton";
    }
    if (world) {
        try {
            extractMinecraftWorld(world, newPath);
        } catch(e) {
            throw "Unable to extract world from zip";
        }
    }
};

export const deleteInstance = (instanceName: string): void => {
    checkForDir();
    let delPath = getInstancePath(instanceName);
    if (fs.existsSync(delPath)) {
        try {
            fs.rmSync(delPath, { recursive: true });
        } catch(e) {
            console.error(e);
            throw "Unable to delete instance";
        }
    } else {
        throw "Instance does not exist";
    }
};

export const getInstancePath = (instanceName: string): string => {
    checkForDir();
    if (instanceName.indexOf("\0") !== -1 || !path.resolve(path.join(instancesPath,instanceName)).startsWith(instancesPath)) {
        throw "Bad path";
    }
    return path.join(instancesPath,instanceName);
};

export const appendToInstanceLogs = (instanceName: string, data: string): void => {
    fs.appendFile(path.join(getInstancePath(instanceName), "server.log"), data, ()=>{});
};

export const getInstanceLogs = (instanceName: string): string => {
    if (fs.existsSync(path.join(getInstancePath(instanceName), "server.log"))) {
        return fs.readFileSync(path.join(getInstancePath(instanceName), "server.log"), "utf-8");
    } else {
        return "";
    }
};
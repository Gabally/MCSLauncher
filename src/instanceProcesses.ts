import { spawn } from "child_process";
import { appendToInstanceLogs, getInstanceInfo, getInstancePath, instanceNameExists } from "./instances";
import { getFormattedDate } from "./utils";

let processes: Record<string,any> = {};

export const startInstance = (name: string, onStart: () => void, onData: (data: any) => void, ondDie: () => void) => {
    if (instanceNameExists(name)) {
        let config = getInstanceInfo(name);
        let serverProcess = spawn("java", ["-Xmx" + (parseInt(config.maxRam) * 1024) + "M", "-Xms" + (parseInt(process.env.MIN_RAM || "1") * 1024) + "M", "-jar", "server.jar", "nogui"],{ cwd: getInstancePath(name) });
        processes[name] = serverProcess;
        appendToInstanceLogs(name, `---PROCESS STARTED----${getFormattedDate()} -----\r\n`);
        onStart();
        serverProcess.on("exit", (code: number) => {
            delete processes[name];
            appendToInstanceLogs(name, `---PROCESS DIED---CODE ${isNaN(code) ? "Unknown" : code}------ ${getFormattedDate()} -----\r\n`);
            ondDie();
        });
        serverProcess.stdout.on("data", (data) => {
            appendToInstanceLogs(name, data);
            onData(data)
        });
        serverProcess.stderr.on("data", (data) => {
            appendToInstanceLogs(name, data);
            onData(data);
        });
    } else {
        throw "Instance does not exist";
    }
};

export const writeToConsole = (instanceName: string, payload: string) => {
    if (isInstanceRunning(instanceName)) {
        processes[instanceName].stdin.write(`${payload}\r\n`);
    }
};

export const stopInstance = (name: string) => {
    if (processes[name]) {
        processes[name].stdin.write("stop\r\n");
        processes[name].stdin.end();
    }
};

export const killInstance = (name: string) => {
    if (processes[name]) {
        processes[name].kill("SIGKILL");
    }
};

export const isInstanceRunning = (name: string): boolean => {
    return processes[name] != null && processes[name] != undefined;
};
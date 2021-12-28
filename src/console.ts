import { URL } from 'url';
import WebSocket from 'ws';
import { sessionParser } from './index';
import { writeToConsole } from './instanceProcesses';
import { getInstanceLogs, instanceNameExists } from './instances';

export const wss = new WebSocket.Server({
    noServer: true,
    verifyClient: (info, done) => {
        //@ts-ignore
        sessionParser(info.req, {}, () => {
            //@ts-ignore
            done(info.req.session.isLoggedIn);
        });
    }
});

wss.on("connection", (ws, req) => {
    //@ts-ignore
    let parsed = new URL(req.url, `http://${req.headers.host}`);
    let instanceName = parsed.searchParams.get("instance") || "";
    if (instanceNameExists(instanceName)) {
        //@ts-ignore
        ws.instance = instanceName;
        WSsendJSON(ws, {
            type: "stdout",
            out: getInstanceLogs(instanceName)
        });
        ws.on("message", (data) => {
            let command = JSON.parse(data.toString());
            switch(command.type) {
                case "command":
                    //@ts-ignore
                    writeToConsole(ws.instance, command.content);
                    break;
            }
        });
    } else {
        ws.close();
    }
});

const getClients = (): WebSocket[] => {
    return Array.from(wss.clients.values());
};

export const WSsendJSON = (ws: WebSocket, data: any) => {
    ws.send(JSON.stringify(data));
}

export const broadCastOutput = (instanceName: string, output: string) => {
    getClients().forEach(ws => {
        //@ts-ignore
        if (ws.instance === instanceName) {
            WSsendJSON(ws, {
                type: "stdout",
                out: output
            });
        }
    });
};

export const broadCastChange = (instanceName: string) => {
    getClients().forEach(ws => {
        //@ts-ignore
        if (ws.instance === instanceName) {
            WSsendJSON(ws, {
                type: "change"
            });
        }
    });
};
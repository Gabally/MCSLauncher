import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { viewsRouter } from "./router/views";
import { apiRouter } from "./router/api";
import session from "express-session";
import { default as MemoryStoreBuilder } from "memorystore";
const MemoryStore = MemoryStoreBuilder(session);
import { wss } from "./console";
import { isLoggedIn } from "./middleware";
import { randomString } from "./utils";

const app = express();

const port =  process.env.APP_PORT || "8000";

export const sessionParser = session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: randomString(20),
    resave: false,
    saveUninitialized: false
});

app.use(sessionParser);

app.use(express.json({ limit: "3mb"})); 

app.use(express.urlencoded({ extended: true })); 

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(isLoggedIn((res, req, next) => {
    if (req.path == "/api/login" || req.path == "/login") {
        next();
    } else {
        res.redirect("/login");
    }
}));

app.use(viewsRouter);

app.use("/api", apiRouter);

let server = app.listen(parseInt(port), process.env.APP_BIND || "127.0.0.1", () => {
    console.log(`App listening at http://${process.env.APP_BIND || "127.0.0.1"}:${port}`);
});

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit("connection", socket, request);
    });
});
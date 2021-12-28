import express from "express";
import api from "../controllers/api";
import multer from "multer";

export const apiRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

apiRouter.post("/login", api.login);
apiRouter.post("/saveconfig/:instanceName", api.saveConfig);
apiRouter.post("/deleteinstance/:instanceName", api.deleteInstance);
apiRouter.post("/startinstance/:instanceName", api.startInstance);
apiRouter.post("/stopinstance/:instanceName", api.stopInstance);
apiRouter.post("/killinstance/:instanceName", api.killInstance);
apiRouter.post("/createinstance", upload.single("world"), api.createInstance);
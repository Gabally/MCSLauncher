import express from "express";
import views from "../controllers/views";

export const viewsRouter = express.Router();

viewsRouter.get("/login", views.login);
viewsRouter.get("/logout", views.logout);
viewsRouter.get("/newinstance", views.newInstance);
viewsRouter.get("/", views.instances);
viewsRouter.get("/instance/:instanceName", views.instance);
viewsRouter.get("/editconfig/:instanceName", views.editConfig);
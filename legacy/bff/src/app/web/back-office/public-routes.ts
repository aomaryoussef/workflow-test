import express from "express";
import path from "path";
import backOfficeController from "./controllers/back-office-controller";

export const publicBackOfficeRouter = express.Router();

publicBackOfficeRouter.use("/static", express.static(path.join(__dirname, "public")));
publicBackOfficeRouter.use("/css", express.static(path.join(__dirname, "public", "css")));
publicBackOfficeRouter.use("/img", express.static(path.join(__dirname, "public", "img")));
publicBackOfficeRouter.use("/fonts", express.static(path.join(__dirname, "public", "fonts")));
publicBackOfficeRouter.use("/files", express.static(path.join(__dirname, "public", "files")));

publicBackOfficeRouter.get("/login", backOfficeController.login);

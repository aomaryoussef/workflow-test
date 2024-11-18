import express from "express";
import path from "path";

export const publicSharedComponentsRouter = express.Router();

publicSharedComponentsRouter.use("/static", express.static(path.join(__dirname, "public")));
publicSharedComponentsRouter.use("/css", express.static(path.join(__dirname, "public", "css")));
publicSharedComponentsRouter.use("/img", express.static(path.join(__dirname, "public", "img")));
publicSharedComponentsRouter.use("/fonts", express.static(path.join(__dirname, "public", "fonts")));
publicSharedComponentsRouter.use("/js", express.static(path.join(__dirname, "public", "js")));

import express from "express";
import {
  login,
  resetPassword,
  forgetPassword,
  postForgetPassword,
  resetPasswordSuccess,
  setFirstPassword,
} from "./controllers/partner-controller";
import path from "path";

export const publicPartnerRouter = express.Router();

publicPartnerRouter.use("/static", express.static(path.join(__dirname, "public")));
publicPartnerRouter.use("/css", express.static(path.join(__dirname, "public", "css")));
publicPartnerRouter.use("/img", express.static(path.join(__dirname, "public", "img")));
publicPartnerRouter.use("/fonts", express.static(path.join(__dirname, "public", "fonts")));
publicPartnerRouter.use("/js", express.static(path.join(__dirname, "public", "js")));
publicPartnerRouter.use("/category", express.static(path.join(__dirname, "public", "categories")));

publicPartnerRouter.get("/login", login);

publicPartnerRouter.get("/forget-password", forgetPassword);
publicPartnerRouter.post("/forget-password", postForgetPassword);
publicPartnerRouter.get("/reset-password", resetPassword);
publicPartnerRouter.get("/reset-password-success", resetPasswordSuccess);
publicPartnerRouter.get("/set-first-password", setFirstPassword);

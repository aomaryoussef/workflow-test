import express from "express";
import { getAllPartners, getCategories, getTopPartners, groupedByCategory } from "./controllers/partner-controller";
import { validateGetPartners } from "./middlewares/validations/partnerValidation";
import { setLanguageAndPagination } from "../middlewares/set-language-and-pagination ";

export const privatePartnerApiRouter = express.Router();
privatePartnerApiRouter.get("/", validateGetPartners, setLanguageAndPagination, getAllPartners);
privatePartnerApiRouter.get("/categories", getCategories);
privatePartnerApiRouter.get("/grouped-by-category", groupedByCategory);
privatePartnerApiRouter.get("/top-partners", setLanguageAndPagination, getTopPartners);

import express from "express";
import { getAllAreas, getAllGovernorates, getAllCitiies } from "./controllers/address-controller";
import { validateGetGovernorates, validateGetAreas, validateGetCities } from "./middlewares/validations/addressValidation";
import { setLanguageAndPagination } from "../middlewares/set-language-and-pagination ";
export const publicLookupApiRouter = express.Router();
publicLookupApiRouter.get("/cities", validateGetCities, setLanguageAndPagination, getAllCitiies);
publicLookupApiRouter.get("/areas", validateGetAreas, setLanguageAndPagination, getAllAreas);
publicLookupApiRouter.get("/governorates", validateGetGovernorates, setLanguageAndPagination, getAllGovernorates);


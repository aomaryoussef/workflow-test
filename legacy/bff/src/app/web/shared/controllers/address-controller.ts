import { Request, Response, NextFunction } from "express";

import { CustomLogger } from "../../../../services/logger";

import { getAreas, getCities, getGovernorates } from "../../../../services/hasura";

const logger = new CustomLogger("address-lookup-controller");


export const getAllGovernorates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("get all governorates");

    let lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;
    const result = await getGovernorates(page, perPage, lang);

    res.json({ data: result.data, totalCount: result.totalCount });
  } catch (e) {
    logger.error(`failed to get all governorates ${e}`);
    next(e);
  }
};
export const getAllCitiies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("get all cities");
    
    let lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;
    const governorateId = isNaN(Number(req.query.governorateId)) ? null : Number(req.query.governorateId)
    const result = await getCities(page, perPage, lang, governorateId);

    res.json({ data: result.data, totalCount: result.totalCount });
  } catch (e) {
    logger.error(`failed to get all cities ${e}`);
    next(e);
  }
};

export const getAllAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("get all areas");
    let lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;
    const cityId = isNaN(Number(req.query.cityId)) ? null : Number(req.query.cityId)
    const governorateId = isNaN(Number(req.query.governorateId)) ? null : Number(req.query.governorateId)
    const result = await getAreas(page, perPage, lang, governorateId, cityId);

    res.json({ data: result.data, totalCount: result.totalCount });
  } catch (e) {
    logger.error(`failed to get all areas ${e}`);
    next(e);
  }
};


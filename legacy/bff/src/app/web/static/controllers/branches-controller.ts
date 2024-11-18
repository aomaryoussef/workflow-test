import { NextFunction, Request, Response } from "express";
import yaml from "js-yaml";
import { readFileSync } from "fs";
import * as path from "path";
import { baseResponse } from "../../base-response";

const index = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sourceFile = path.join(__dirname, "../data/branches.yml");
    const branches = yaml.load(readFileSync(sourceFile, "utf8"));

    res.send(baseResponse(branches));
  } catch (err) {
    next(err);
  }
};

export default { index };

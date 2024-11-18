"use client";

import {
  CustomParams,
  CustomResponse,
  GetManyParams,
  GetManyResponse,
} from "@refinedev/core";
import type {
  BaseRecord,
  DataProvider,
} from "@refinedev/core";


export const dataProvider: DataProvider = {
  getOne: () => {
    throw new Error("Not implemented");
  },
  update: () => {
    throw new Error("Not implemented");
  },
  getList: () => {
    throw new Error("Fetching a list of partners is not implemented yet");
  },
  create: async () => {
    throw new Error("Not implemented");
  },
  getApiUrl: () => {
    throw new Error("Not implemented");
  },
  deleteOne: () => {
    throw new Error("Not implemented");
  },
  getMany: function <TData extends BaseRecord = BaseRecord>(
    params: GetManyParams
  ): Promise<GetManyResponse<TData>> {
    throw new Error("Function not implemented.");
  },
  custom: function <
    TData extends BaseRecord = BaseRecord,
    TQuery = unknown,
    TPayload = unknown
  >(params: CustomParams<TQuery, TPayload>): Promise<CustomResponse<TData>> {
    throw new Error("Function not implemented.");
  },
};

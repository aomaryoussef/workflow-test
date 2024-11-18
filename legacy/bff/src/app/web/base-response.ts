import { decamelizeKeys } from "humps";

export const baseResponse = (data: unknown) => {
  return {
    data: decamelizeKeys(data),
  };
};

import { AxiosResponse } from "axios";
import { DbEntry } from "../../sharedWithServer/Analyzer/DbEntry";
import { is } from "../../sharedWithServer/Crud";

export const generalValidators = {
  dbId(res: AxiosResponse<unknown> | undefined): { data: string } | undefined {
    if (res && is.dbId(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
  dbEntry(
    res: AxiosResponse<unknown> | undefined
  ): { data: DbEntry } | undefined {
    if (res && is.dbEntry(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
};

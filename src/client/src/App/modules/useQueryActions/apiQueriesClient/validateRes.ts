import { AxiosResponse } from "axios";
import { Id } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import { SectionPack } from "../../../sharedWithServer/Analyzer/SectionPack";
import { QueryError } from "../../../sharedWithServer/apiQueriesShared";
import {
  DbIdRes,
  SectionPackRes,
} from "../../../sharedWithServer/apiQueriesShared/shared";
import { Obj } from "../../../sharedWithServer/utils/Obj";

export function validateDbIdRes(res: AxiosResponse<unknown>): DbIdRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { dbId } = data;
    if (Id.is(dbId)) {
      return {
        data: {
          dbId,
        },
      };
    }
  }
  throw makeResValidationQueryError();
}
export function validateServerSectionPackRes(
  res: AxiosResponse<unknown>
): SectionPackRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { rawServerSectionPack } = data;
    if (
      SectionPack.isRaw(rawServerSectionPack, {
        contextName: "db",
        sectionType: "dbStore",
      })
    ) {
      return {
        data: {
          rawServerSectionPack,
        },
      };
    }
  }
  throw makeResValidationQueryError();
}

export function makeResValidationQueryError() {
  return new QueryError("Response failed validation.");
}

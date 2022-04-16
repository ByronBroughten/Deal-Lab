import { AxiosResponse } from "axios";
import { Id } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import { SectionNam } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { SectionPack } from "../../../sharedWithServer/Analyzer/SectionPack";
import { QueryError } from "../../../sharedWithServer/apiQueriesShared";
import {
  DbIdRes,
  DbStoreNameRes,
  makeRes,
  SectionPackRes,
} from "../../../sharedWithServer/apiQueriesShared/shared";
import { Obj } from "../../../sharedWithServer/utils/Obj";

export function validateDbIdRes(res: AxiosResponse<unknown>): DbIdRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { dbId } = data;
    if (Id.is(dbId)) return makeRes({ dbId });
  }
  throw makeResValidationQueryError();
}
export function validateDbStoreNameRes(
  res: AxiosResponse<unknown>
): DbStoreNameRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { dbStoreName } = data;
    if (SectionNam.is(dbStoreName, "dbStore")) return makeRes({ dbStoreName });
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
    )
      return makeRes({ rawServerSectionPack });
  }
  throw makeResValidationQueryError();
}

export function makeResValidationQueryError() {
  return new QueryError("Response failed validation.");
}

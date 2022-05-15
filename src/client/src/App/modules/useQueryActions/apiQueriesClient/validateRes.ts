import { AxiosResponse } from "axios";
import { SectionPack } from "../../../sharedWithServer/Analyzer/SectionPack";
import { QueryError } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  DbIdRes,
  DbStoreNameRes,
  makeRes,
  SectionPackRes,
} from "../../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { Id } from "../../../sharedWithServer/SectionsMeta/baseSections/id";
import { savableNameS } from "../../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
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
    if (savableNameS.is(dbStoreName)) return makeRes({ dbStoreName });
  }
  throw makeResValidationQueryError();
}
export function validateServerSectionPackRes(
  res: AxiosResponse<unknown>
): SectionPackRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { rawServerSectionPack } = data;
    if (SectionPack.isRaw(rawServerSectionPack, "dbStoreNext")) {
      return makeRes({ rawServerSectionPack });
    }
  }
  throw makeResValidationQueryError();
}

export function makeResValidationQueryError() {
  return new QueryError("Response failed validation.");
}

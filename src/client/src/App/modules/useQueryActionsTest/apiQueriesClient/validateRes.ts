import { AxiosResponse } from "axios";
import { QueryError } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  DbIdRes,
  DbStoreNameRes,
  makeRes,
  SectionPackRes,
} from "../../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { sectionPackS } from "../../../sharedWithServer/SectionPack/SectionPack";
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
    const { sectionName } = data;
    if (savableNameS.is(sectionName)) return makeRes({ sectionName });
  }
  throw makeResValidationQueryError();
}
export function validateServerSectionPackRes(
  res: AxiosResponse<unknown>
): SectionPackRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { sectionPack } = data;
    if (sectionPackS.isRaw(sectionPack, "dbStoreNext")) {
      return makeRes({ sectionPack });
    }
  }
  throw makeResValidationQueryError();
}

export function makeResValidationQueryError() {
  return new QueryError("Response failed validation.");
}

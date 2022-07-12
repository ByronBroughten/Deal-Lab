import { AxiosResponse } from "axios";
import {
  DbIdRes,
  DbStoreNameRes,
  makeRes,
  SectionPackRes,
} from "../../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { isSectionPack } from "../../../sharedWithServer/SectionPack/SectionPack";
import { Id } from "../../../sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import { dbStoreNameS } from "../../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/dbStoreNameArrs";
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
    if (dbStoreNameS.is(dbStoreName)) return makeRes({ dbStoreName });
  }
  throw makeResValidationQueryError();
}
export function validateServerSectionPackRes(
  res: AxiosResponse<unknown>
): SectionPackRes {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { sectionPack } = data;
    if (isSectionPack(sectionPack)) {
      return makeRes({ sectionPack }) as SectionPackRes;
    }
  }
  throw makeResValidationQueryError();
}

export function makeResValidationQueryError() {
  return new Error("Response failed validation.");
}

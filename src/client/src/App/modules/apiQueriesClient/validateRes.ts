import { AxiosResponse } from "axios";
import {
  DbIdRes,
  DbStoreNameRes,
  makeRes,
  SectionPackRes,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import {
  DbStoreNameByType,
  dbStoreNameS,
} from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { isSectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { Obj } from "../../sharedWithServer/utils/Obj";

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
    if (dbStoreNameS.is(dbStoreName, "allQuery"))
      return makeRes({ dbStoreName });
  }
  throw makeResValidationQueryError();
}

export function validateDbArrQueryNameRes(
  res: AxiosResponse<unknown>
): DbStoreNameRes<DbStoreNameByType<"arrQuery">> {
  const { data } = res;
  if (Obj.isAnyIfIsObj(data)) {
    const { dbStoreName } = data;
    if (dbStoreNameS.is(dbStoreName, "arrQuery"))
      return makeRes({ dbStoreName });
  }
  throw makeResValidationQueryError();
}

export function validateDbSectionPackRes(
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

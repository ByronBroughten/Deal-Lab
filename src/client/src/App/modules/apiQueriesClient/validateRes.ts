import { AxiosResponse } from "axios";
import {
  DbIdRes,
  DbStoreNameRes,
  makeRes,
  SectionPackRes,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs/id";
import {
  DbStoreNameByType,
  dbStoreNameS,
} from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { isSectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { Obj } from "../../sharedWithServer/utils/Obj";

type DbIdData = { dbId: string };
export function isDbIdData(value: any): value is DbIdData {
  if (Obj.isObjToAny(value)) {
    const { dbId } = value;
    if (Id.is(dbId)) return true;
  }
  return false;
}

export function validateDbIdRes(res: AxiosResponse<unknown>): DbIdRes {
  const { data } = res;
  if (isDbIdData(data)) {
    return makeRes({ dbId: data.dbId });
  } else throw makeResValidationQueryError();
}
export function validateDbStoreNameRes(
  res: AxiosResponse<unknown>
): DbStoreNameRes {
  const { data } = res;
  if (Obj.isObjToAny(data)) {
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
  if (Obj.isObjToAny(data)) {
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
  if (Obj.isObjToAny(data)) {
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

import { AxiosResponse } from "axios";
import {
  DbIdRes,
  MakeRes,
  makeRes,
  SectionPackRes,
  UrlRes,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../sharedWithServer/SectionsMeta/Id";
import { validateSectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { Str } from "../../sharedWithServer/utils/Str";

export function validateDbIdRes(res: AxiosResponse<unknown>): DbIdRes {
  const axiosRes = validateAxiosRes(res);
  const data = validateDbIdData(axiosRes.data);
  return makeRes({ dbId: data.dbId });
}

type DbIdData = { dbId: string };
export function validateDbIdData(value: any): DbIdData {
  value = Obj.validateObjToAny(value);
  return {
    dbId: Id.validate(value),
  };
}

export function validateAxiosRes(res: AxiosResponse<unknown>): MakeRes<any> {
  const obj = Obj.validateObjToAny(res);
  Obj.validateObjToAny(obj.data);
  return obj;
}

export function validateSessionUrlRes(res: AxiosResponse<unknown>): UrlRes {
  const urlRes = Obj.validateObjToAny(res) as UrlRes;
  const data = Obj.validateObjToAny(urlRes) as UrlRes["data"];
  return makeRes({
    sessionUrl: Str.validate(data.sessionUrl),
  });
}

export function validateDbSectionPackRes(
  res: AxiosResponse<unknown>
): SectionPackRes {
  res = Obj.validateObjToAny(res);
  const data = Obj.validateObjToAny(res.data);
  return makeRes({
    sectionPack: validateSectionPack(data.sectionPack),
  });
}

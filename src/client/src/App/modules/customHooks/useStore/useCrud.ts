import { AxiosResponse } from "axios";
import { is, Req, Res } from "../../../sharedWithServer/User/crudTypes";
import https from "../../services/httpService";
import { DbStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { DbEntry } from "../../../sharedWithServer/Analyzer/DbEntry";
import { SectionName } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { urls } from "./../../../Constants";

const validateRes = {
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
  dbEntryArr(
    res: AxiosResponse<unknown> | undefined
  ): Res<"PostTableColumns"> | undefined {
    if (res && is.dbEntryArr(res.data)) {
      return {
        data: res.data,
      };
    } else return undefined;
  },
};

export const crud = {
  async postSection(
    dbEntry: DbEntry,
    dbStoreName: DbStoreName
  ): Promise<Res<"PostEntry"> | undefined> {
    const reqObj: Req<"PostEntry"> = {
      body: {
        dbStoreName,
        payload: dbEntry,
      },
    };
    const res = await https.post(`saving`, urls.section.path, reqObj.body);
    return validateRes.dbId(res);
  },
  async postEntryArr(
    dbEntryArr: DbEntry[],
    dbStoreName: DbStoreName
  ): Promise<Res<"PostEntryArr"> | undefined> {
    const reqObj: Req<"PostEntryArr"> = {
      body: {
        payload: dbEntryArr,
        dbStoreName,
      },
    };
    const res = await https.post("saving", urls.sectionArr.path, reqObj.body);
    return validateRes.dbId(res);
  },
  async postTableColumns(
    dbEntryArr: DbEntry[],
    dbStoreName: SectionName<"table">
  ) {
    const reqObj: Req<"PostTableColumns"> = {
      body: {
        payload: dbEntryArr,
        dbStoreName,
      },
    };
    const res = await https.post("saving", urls.tableColumns.path, reqObj.body);
    return validateRes.dbEntryArr(res);
  },
  async putEntry(
    dbEntry: DbEntry,
    dbStoreName: DbStoreName
  ): Promise<Res<"PutEntry"> | undefined> {
    const reqObj: Req<"PutEntry"> = {
      body: {
        payload: dbEntry,
        dbStoreName,
      },
    };
    const res = await https.put("updating", urls.section.path, reqObj.body);
    return validateRes.dbId(res);
  },
  async getEntry(
    dbStoreName: DbStoreName,
    dbId: string
  ): Promise<Res<"GetEntry"> | undefined> {
    const reqObj: Req<"GetEntry"> = {
      params: {
        dbStoreName,
        dbId,
      },
    };
    // to get the params correctly, I can unjoin the names from the url string
    // and then use that array to index params in the correct order.
    const res = await https.get(`loading from ${dbStoreName}`, urls.section.path, [
      ...Object.values(reqObj.params),
    ]);
    return validateRes.dbEntry(res);
  },
  async deleteEntry(
    dbId: string,
    dbStoreName: DbStoreName
  ): Promise<Res<"DeleteEntry"> | undefined> {
    const reqObj: Req<"DeleteEntry"> = {
      params: {
        dbStoreName,
        dbId,
      },
    };
    const res = await https.delete(
      `deleting from ${dbStoreName}`,
      urls.section.path,
      [...Object.values(reqObj.params)]
    );
    return validateRes.dbId(res);
  },
} as const;

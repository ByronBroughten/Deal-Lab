import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import {
  SectionPackRaw,
  ServerSectionPack,
} from "../../sharedWithServer/Analyzer/SectionPackRaw";
import { DbStoreNameNext } from "../../sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { SectionName } from "../../sharedWithServer/SectionMetas/SectionName";
import { ApiQueries, apiQueries } from "../useQueryActions/apiQueriesClient";

class BaseQuerierNext {
  get apiQuery(): ApiQueries {
    return apiQueries;
  }
  makeReq<B extends QueryObj>(body: B): MakeReq<B> {
    return { body };
  }
}

export class SectionQuerier extends BaseQuerierNext {
  constructor(readonly sectionName: SectionName<"indexStore">) {
    super();
  }

  async add(sectionPack: ServerSectionPack): Promise<string> {
    const res = await this.apiQuery.addSection(this.makeReq({ sectionPack }));
    return res.data.dbId;
  }
  async update(sectionPack: ServerSectionPack): Promise<string> {
    const res = await this.apiQuery.updateSection(
      this.makeReq({ sectionPack })
    );
    return res.data.dbId;
  }
  async get(dbId: string): Promise<ServerSectionPack> {
    const res = await this.apiQuery.getSection(
      this.makeReq({
        dbStoreName: this.sectionName,
        dbId,
      })
    );
    return res.data.rawServerSectionPack;
  }
  async delete(dbId: string): Promise<string> {
    const res = await this.apiQuery.deleteSection(
      this.makeReq({ dbStoreName: this.sectionName, dbId })
    );
    return res.data.dbId;
  }
}

export class SectionArrQuerier extends BaseQuerierNext {
  constructor(readonly sectionName: DbStoreNameNext<"arrStore">) {
    super();
  }

  async replace(
    feSectionPackArr: SectionPackRaw<"fe", DbStoreNameNext<"arrStore">>[]
  ): Promise<DbStoreNameNext<"arrStore">> {
    const serverSectionPackArr = feSectionPackArr.map((rawPack) =>
      FeSectionPack.rawFeToServer(rawPack, this.sectionName as any)
    );

    const res = await this.apiQuery.replaceSectionArr(
      this.makeReq({
        dbStoreName: this.sectionName,
        sectionPackArr: serverSectionPackArr,
      })
    );
    return res.data.dbStoreName as DbStoreNameNext<"arrStore">;
  }
}

type MakeReq<B extends QueryObj> = {
  body: B;
};
type QueryObj = { [key: string]: any };

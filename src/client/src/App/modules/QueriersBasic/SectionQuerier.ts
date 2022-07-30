import {
  makeReq,
  SectionPackReq,
} from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { ChildName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildName";
import {
  DbSectionName,
  DbStoreNameByType,
} from "../../sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

export interface SectionQuerierProps<CN extends ChildName<"dbStore">>
  extends ApiQuerierBaseProps {
  dbStoreName: CN;
}

export class SectionQuerier<
  CN extends DbStoreNameByType<"sectionQuery">
> extends ApiQuerierBase {
  readonly dbStoreName: CN;
  constructor({ dbStoreName, ...rest }: SectionQuerierProps<CN>) {
    super(rest);
    this.dbStoreName = dbStoreName;
  }
  makeDbPackReq(
    sectionPack: SectionPack<DbSectionName<CN>>
  ): SectionPackReq<CN> {
    return makeReq({
      dbStoreName: this.dbStoreName,
      sectionPack,
    });
  }
  async add(sectionPack: SectionPack<DbSectionName<CN>>): Promise<string> {
    const req = this.makeDbPackReq(sectionPack);
    const res = await this.apiQueries.addSection(req);
    return res.data.dbId;
  }
  async update(sectionPack: SectionPack<DbSectionName<CN>>): Promise<string> {
    const req = this.makeDbPackReq(sectionPack);
    const res = await this.apiQueries.updateSection(req);
    return res.data.dbId;
  }
  async get(dbId: string): Promise<SectionPack<DbSectionName<CN>>> {
    const req = makeReq({
      dbStoreName: this.dbStoreName,
      dbId,
    } as const);
    const res = await this.apiQueries.getSection(req);
    return res.data.sectionPack as SectionPack<any>;
  }
  async delete(dbId: string): Promise<string> {
    const req = makeReq({
      dbStoreName: this.dbStoreName,
      dbId,
    } as const);
    const res = await this.apiQueries.deleteSection(req);
    return res.data.dbId;
  }
}

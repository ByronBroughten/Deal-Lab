import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

interface SectionQuerierProps extends ApiQuerierBaseProps {
  sectionName: SectionName<"dbStoreNext">;
}

export class SectionQuerier extends ApiQuerierBase {
  readonly sectionName: SectionName<"dbStoreNext">;
  constructor({ sectionName, ...rest }: SectionQuerierProps) {
    super(rest);
    this.sectionName = sectionName;
  }

  async add(sectionPack: ServerSectionPack): Promise<string> {
    const req = makeReq({ sectionPack });
    const res = await this.apiQueries.addSection(req);
    return res.data.dbId;
  }
  async update(sectionPack: ServerSectionPack): Promise<string> {
    const req = makeReq({ sectionPack });
    const res = await this.apiQueries.updateSection(req);
    return res.data.dbId;
  }
  async get(dbId: string): Promise<ServerSectionPack> {
    const req = makeReq({
      sectionName: this.sectionName,
      dbId,
    } as const);
    const res = await this.apiQueries.getSection(req);
    return res.data.rawServerSectionPack;
  }
  async delete(dbId: string): Promise<string> {
    const req = makeReq({
      sectionName: this.sectionName,
      dbId,
    } as const);
    const res = await this.apiQueries.deleteSection(req);
    return res.data.dbId;
  }
}

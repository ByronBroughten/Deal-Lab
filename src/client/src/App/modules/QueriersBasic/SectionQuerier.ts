import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { ApiQuerierNext, ApiQuerierProps } from "./ApiQuerierNext";

interface SectionQuerierProps extends ApiQuerierProps {
  sectionName: SectionName<"indexStore">;
}

export class SectionQuerier {
  readonly sectionName: SectionName<"indexStore">;
  readonly api: ApiQuerierNext;
  constructor({ sectionName, ...rest }: SectionQuerierProps) {
    this.sectionName = sectionName;
    this.api = new ApiQuerierNext(rest);
  }
  async add(sectionPack: ServerSectionPack): Promise<string> {
    const req = this.api.makeReq({ sectionPack });
    const res = await this.api.query.addSection(req);
    return res.data.dbId;
  }
  async update(sectionPack: ServerSectionPack): Promise<string> {
    const req = this.api.makeReq({ sectionPack });
    const res = await this.api.query.updateSection(req);
    return res.data.dbId;
  }
  async get(dbId: string): Promise<ServerSectionPack> {
    const req = this.api.makeReq({
      dbStoreName: this.sectionName,
      dbId,
    } as const);
    const res = await this.api.query.getSection(req);
    return res.data.rawServerSectionPack;
  }
  async delete(dbId: string): Promise<string> {
    const req = this.api.makeReq({
      dbStoreName: this.sectionName,
      dbId,
    } as const);
    const res = await this.api.query.deleteSection(req);
    return res.data.dbId;
  }
}

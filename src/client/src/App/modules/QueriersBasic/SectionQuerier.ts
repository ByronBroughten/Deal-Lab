import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { ApiQuerier } from "./ApiQuerier";

export class SectionQuerier {
  constructor(readonly sectionName: SectionName<"indexStore">) {}
  api = new ApiQuerier();

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

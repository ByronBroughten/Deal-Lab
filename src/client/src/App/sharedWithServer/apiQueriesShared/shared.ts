import { SectionName } from "../Analyzer/SectionMetas/SectionName";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";

export type SectionPackReq = {
  body: {
    payload: SectionPackRaw<"db", SectionName<"dbStore">>;
  };
};

export type DbSectionPackInfo = {
  dbStoreName: SectionName<"dbStore">;
  dbId: string;
};

export type DbSectionPackInfoReq = {
  body: DbSectionPackInfo;
};

export type SectionPackRes = {
  data: {
    rawServerSectionPack: SectionPackRaw<"db", SectionName<"dbStore">>;
  };
};
export type DbIdRes = {
  data: {
    dbId: string;
  };
};

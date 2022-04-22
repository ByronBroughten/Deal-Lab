import { config } from "../Constants";
import { DbEntry, zDbEntry, zDbEntryArr } from "./Analyzer/DbEntry";
import { SectionName } from "./Analyzer/SectionMetas/SectionName";
import { zNanoId } from "./utils/zod";

export const authTokenKey = "x-auth-token";

type Crud = {
  PostEntry: {
    Req: {
      body: {
        payload: DbEntry;
        dbStoreName: SectionName<"dbStore">;
      };
    };
    Res: {
      data: string; // dbId
    };
  };
  PostSectionArr: {
    Req: {
      body: {
        payload: DbEntry[];
        dbStoreName: SectionName<"dbStore">;
      };
    };
    Res: Crud["PostEntry"]["Res"];
  };
  PostTableColumns: {
    Req: {
      body: {
        payload: DbEntry[];
        dbStoreName: SectionName<"table">;
      };
    };
    Res: {
      data: DbEntry[]; // indexRowArr
    };
  };
  PutSection: Crud["PostEntry"];
  GetSection: {
    Req: {
      params: ArrToParams<
        typeof config.url.section.params.get,
        {
          dbStoreName: SectionName<"dbStore">;
          dbId: string;
        }
      >;
    };
    Res: {
      data: DbEntry;
    };
  };
  DeleteSection: {
    Req: {
      params: ArrToParams<
        typeof config.url.section.params.delete,
        {
          dbStoreName: SectionName<"dbStore">;
          dbId: string;
        }
      >;
    };
    Res: {
      data: string; // dbId
    };
  };
};

export type Req<K extends keyof Crud> = Crud[K]["Req"];
export type Res<K extends keyof Crud> = Crud[K]["Res"];

export type DbId = string;
export const is = {
  dbId(value: any): value is DbId {
    return zNanoId.safeParse(value).success;
  },
  dbEntry(value: any): value is DbEntry {
    return zDbEntry.safeParse(value).success;
  },
  dbEntryArr(value: any): value is DbEntry[] {
    return zDbEntryArr.safeParse(value).success;
  },
};

type ArrToParams<
  A extends readonly string[],
  B extends { [Prop in A[number]]: string }
> = B;

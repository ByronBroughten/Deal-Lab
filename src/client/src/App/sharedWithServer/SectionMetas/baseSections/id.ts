import { nanoid } from "nanoid";
import { z } from "zod";
import { StrictExtract } from "../../utils/types";

export type RelativeIds = {
  inVarb: "children" | "local" | "static" | "all";
  singleInVarb: "local" | "static";
  outVarb: "parent" | "local" | "static" | "all";
  focal: "static" | "local" | "parent";
  multi: "children" | "all";
  static: "static";
  local: "local";
  children: "children";
};
type RelType = keyof RelativeIds;
export type Relative<T extends RelType = RelType> = RelativeIds[T];

export interface FeIdInfo {
  id: string;
  idType: "feId";
}
export interface DbIdInfo {
  id: string;
  idType: "dbId";
}
export interface RelIdInfo {
  id: Relative;
  idType: "relative";
}

interface IdInfo {
  fe: FeIdInfo;
  db: DbIdInfo;
  rel: RelIdInfo;
}

type IdType = IdInfo[keyof IdInfo]["idType"];

type RandomStringIdType = StrictExtract<IdType, "feId" | "dbId">;
export interface RandomStringIdInfo {
  id: string;
  idType: RandomStringIdType;
}

export type SpecificIdInfo =
  | RandomStringIdInfo
  | {
      id: "static";
      idType: "relative";
    };

type ID = string;
export const Id = {
  length: 12,
  get zodSchema() {
    return z.string().max(this.length).min(this.length);
  },
  is(value: any): value is ID {
    return this.zodSchema.safeParse(value).success;
  },
  make() {
    return nanoid(this.length);
  },
} as const;

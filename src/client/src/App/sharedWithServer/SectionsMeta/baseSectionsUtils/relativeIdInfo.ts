import { GeneralIdInfo, NanoIdInfo } from "./baseIdInfo";

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

export interface RelIdInfo extends GeneralIdInfo {
  id: Relative;
  idType: "relative";
}
export type SpecificIdInfo =
  | NanoIdInfo
  | {
      id: "static";
      idType: "relative";
    };

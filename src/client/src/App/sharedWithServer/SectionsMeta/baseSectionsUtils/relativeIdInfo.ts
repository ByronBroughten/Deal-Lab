import { GeneralIdInfo, NanoIdInfo } from "./NanoIdInfo";

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
  infoType: "relative";
}
export interface RelChildrenIdInfo {
  id: "children";
  infoType: "relative";
}
export type SpecificIdInfo =
  | NanoIdInfo
  | {
      id: "static";
      infoType: "relative";
    };

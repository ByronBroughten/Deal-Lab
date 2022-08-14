import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarb } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export const userVarbItemRelVarbs: RelVarbs<"userVarbItem"> = {
  ...relVarbsS.listItemVirtualVarb,
  valueSwitch: relVarb("string", {
    initValue: "labeledEquation",
  }),
  numObjEditor: relVarb("numObj"),
  value: relVarb("numObj", {
    displayName: relVarbInfoS.local("displayName"),
    updateFnName: "userVarb",
    initValue: numObj(0),
    updateFnProps: {
      ...relVarbInfosS.localByVarbName(["valueSwitch", "numObjEditor"]),
      ...relVarbInfosS.namedChildren("conditionalRow", {
        rowLevel: "level",
        rowType: "type",
        rowLeft: "left",
        rowOperator: "operator",
        rowRightValue: "rightValue",
        rowRightList: "rightList",
        rowThen: "then",
      }),
    },
    unit: "decimal",
  }),
} as const;

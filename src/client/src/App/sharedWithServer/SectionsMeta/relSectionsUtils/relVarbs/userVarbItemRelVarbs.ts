import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarb, relVarbS } from "../rel/relVarb";

export const userVarbItemRelVarbs = {
  name: relVarbS.string(),
  startAdornment: relVarbS.string(),
  endAdornment: relVarbS.string(),
  valueSwitch: relVarbS.string({
    initValue: "labeledEquation",
  }),
  editorValue: relVarb("numObj"),
  value: relVarb("numObj", {
    displayName: relVarbInfoS.local("name"),
    updateFnName: "userVarb",
    initValue: numObj(0),
    updateFnProps: {
      ...relVarbInfosS.localByVarbName(["valueSwitch", "editorValue"]),
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
  }),
} as const;

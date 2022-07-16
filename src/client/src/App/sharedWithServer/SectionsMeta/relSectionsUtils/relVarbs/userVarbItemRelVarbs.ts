import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarb } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export const userVarbItemRelVarbs: RelVarbs<"userVarbItem"> = {
  ...relVarbsS.listItem,
  startAdornment: relVarb("string"),
  endAdornment: relVarb("string"),
  valueSwitch: relVarb("string", {
    initValue: "labeledEquation",
  }),
  editorValue: relVarb("numObj"),
  value: relVarb("numObj", {
    displayName: relVarbInfoS.local("displayName"),
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

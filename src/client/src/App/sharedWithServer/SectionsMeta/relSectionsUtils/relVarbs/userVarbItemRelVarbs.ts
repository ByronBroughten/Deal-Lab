import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { relProps } from "../rel/relMisc";
import { relVarbS } from "../rel/relVarb";
import { relVarbInfo } from "../rel/relVarbInfo";

export const userVarbItemRelVarbs = {
  name: relVarbS.string(),
  startAdornment: relVarbS.string(),
  endAdornment: relVarbS.string(),
  valueSwitch: relVarbS.string({
    initValue: "labeledEquation",
  }),
  editorValue: relVarbS.type("numObj"),
  value: relVarbS.type("numObj", {
    displayName: relVarbInfo.relative("userVarbItem", "name", "local"),
    updateFnName: "userVarb",
    initValue: numObj(0),
    updateFnProps: {
      varbType: relVarbInfo.relative("userVarbItem", "valueSwitch", "local"),
      ...relProps.named("local", [
        ["valueSwitch", "userVarbItem", "valueSwitch"],
        ["editorValue", "userVarbItem", "editorValue"],
      ]),
      ...relProps.named("children", [
        ["rowLevel", "conditionalRow", "level"],
        ["rowType", "conditionalRow", "type"],
        ["rowLeft", "conditionalRow", "left"],
        ["rowOperator", "conditionalRow", "operator"],
        ["rowrightValue", "conditionalRow", "rightValue"],
        ["rowrightList", "conditionalRow", "rightList"],
        ["rowThen", "conditionalRow", "then"],
      ]),
    },
  }),
} as const;

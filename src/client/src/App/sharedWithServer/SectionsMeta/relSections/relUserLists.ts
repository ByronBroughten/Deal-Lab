import { numObj } from "../baseSections/baseValues/NumObj";
import { rel } from "./rel";

export const userVarbItemVarbs = {
  name: rel.varb.string(),
  startAdornment: rel.varb.string(),
  endAdornment: rel.varb.string(),
  valueSwitch: rel.varb.string({
    initValue: "labeledEquation",
  }),
  editorValue: rel.varb.type("numObj"),
  value: rel.varb.type("numObj", {
    displayName: rel.varbInfo.relative("userVarbItem", "name", "local"),
    updateFnName: "userVarb",
    initValue: numObj(0),
    updateFnProps: {
      varbType: rel.varbInfo.relative("userVarbItem", "valueSwitch", "local"),
      ...rel.props.named("local", [
        ["valueSwitch", "userVarbItem", "valueSwitch"],
        ["editorValue", "userVarbItem", "editorValue"],
      ]),
      ...rel.props.named("children", [
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

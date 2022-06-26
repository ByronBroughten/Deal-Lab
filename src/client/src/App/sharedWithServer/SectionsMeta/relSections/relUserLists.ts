import { StrictOmit } from "../../utils/types";
import { numObj } from "../baseSections/baseValues/NumObj";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function userVarbList<
  SN extends "userVarbList" | "internalVarbList" | "varbList",
  O extends StrictOmit<
    RelSectionOptions<"userVarbList">,
    "children" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    sectionName,
    "User Variable List",
    {
      ...rel.varbs.savableSection,
      defaultValueSwitch: rel.varb.string({
        initValue: "labeledEquation",
      }),
    } as RelVarbs<SN>,
    {
      ...((options ?? {}) as O),
      children: { userVarbItem: { sectionName: "userVarbItem" } },
    }
  );
}

export const preUserLists = {
  ...rel.section.singleTimeList("userSingleList", "User List", {
    arrStoreName: "singleTimeList",
  }),
  ...rel.section.ongoingList("userOngoingList", "User Ongoing List", {
    arrStoreName: "ongoingList",
  }),
  ...userVarbList("varbList", {
    arrStoreName: "varbList",
  }),
  ...userVarbList("userVarbList", {
    arrStoreName: "varbList",
  }),
  ...userVarbList("internalVarbList"),
  ...relSection.base(
    "userVarbItem",
    "User Variable",
    {
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
          varbType: rel.varbInfo.relative(
            "userVarbItem",
            "valueSwitch",
            "local"
          ),
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
    },
    { children: { conditionalRow: { sectionName: "conditionalRow" } } }
  ),

  ...relSection.base(
    "conditionalRow",
    "Conditional Row",
    {
      level: rel.varb.type("number"),
      type: rel.varb.string({ initValue: "if" }),
      // if
      left: rel.varb.type("numObj"),
      operator: rel.varb.string({ initValue: "===" }),
      rightList: rel.varb.type("stringArray"),
      rightValue: rel.varb.type("numObj"),
      // then
      then: rel.varb.type("numObj"),
    }
    // {
    //   initBunch: [
    //     { type: "if", level: 0 },
    //     { type: "then", level: 0 },
    //     { type: "or else", level: 0 },
    //   ],
    // }
  ),
} as const;

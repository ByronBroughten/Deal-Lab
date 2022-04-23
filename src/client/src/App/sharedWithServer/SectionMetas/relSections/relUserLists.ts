import { rel } from "./rel";
import { relSection } from "./rel/relSection";

export const preUserLists = {
  ...rel.section.singleTimeList("userSingleList", "User List"),
  ...rel.section.ongoingList("userOngoingList", "User Ongoing List"),
  ...relSection.base(
    "both",
    "userVarbList",
    "List of Variables",
    {
      title: rel.varb.string(),
      defaultValueSwitch: rel.varb.string({ initValue: "labeledEquation" }),
    },
    {
      childNames: ["userVarbItem"] as const,
    }
  ),
  ...relSection.base(
    "both",
    "userVarbItem",
    "User Variable",
    {
      name: rel.varb.string(),
      startAdornment: rel.varb.string(),
      endAdornment: rel.varb.string(),
      valueSwitch: rel.varb.string({ initValue: "labeledEquation" }),
      editorValue: rel.varb.type("numObj"),
      value: rel.varb.type("numObj", {
        displayName: rel.varbInfo.relative("userVarbItem", "name", "local"),
        updateFnName: "userVarb",
        initValue: rel.value.numObj(0),
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
    {
      childNames: ["conditionalRow"] as const,
    }
  ),

  ...relSection.base(
    "both",
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

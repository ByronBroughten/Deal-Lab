import { NumObj } from "../../SectionsMeta/baseSections/baseValues/NumObj";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";

type LevelsThatPass = Record<number, boolean>;
export class UserVarbValueSolver extends GetterSectionBase<"userVarbItem"> {
  private getterSection = new GetterSection(this.getterSectionProps);
  getUserVarbValue(): NumObj {
    const varbType = this.getterSection.value("valueSwitch", "string") as
      | "labeledEquation"
      | "ifThen";

    if (varbType === "labeledEquation")
      return this.getterSection.value("editorValue", "numObj");
    else return this.conditionalUserVarbValue();
  }
  conditionalUserVarbValue(): NumObj {
    const rows = this.getterSection.children("conditionalRow");
    const levelsThatPass: LevelsThatPass = {};
    for (const row of rows) {
      const vals = row.varbs.values({
        type: "string",
        level: "number",
        left: "numObj",
        operator: "string",
        rightList: "stringArray",
        rightValue: "numObj",
        then: "numObj",
      });
      const result = this.checkRow(vals, levelsThatPass);
      if (result) return result;
    }
    throw new Error(
      "Something went wrong. Conditional logic yielded no value."
    );
  }
  checkRow(
    {
      type,
      level,
      left,
      operator,
      rightList,
      rightValue,
      then,
    }: {
      type: string;
      level: number;
      left: NumObj;
      operator: string;
      rightList: string[];
      rightValue: NumObj;
      then: NumObj;
    },
    levelsThatPass: LevelsThatPass
  ): false | NumObj {
    if (conditionalTypes.includes(type)) {
      if (type === "if" || !levelsThatPass[level])
        this.updateLevelsThatPass(levelsThatPass, {
          level,
          left,
          operator,
          rightList,
          rightValue,
        });
      return false;
    }
    if (resultTypes.includes(type)) {
      if (type === "or else" || isResultRow(level, levelsThatPass)) return then;
      else return false;
    }
    throw new Error(`type "${type}" is invalid'`);
  }
  updateLevelsThatPass(
    levelsThatPass: LevelsThatPass,
    {
      level,
      left,
      operator,
      rightList,
      rightValue,
    }: {
      level: number;
      left: NumObj;
      operator: string;
      rightList: string[];
      rightValue: NumObj;
    }
  ) {
    for (const num in levelsThatPass) {
      if (parseInt(num) > level) delete levelsThatPass[num];
    }
    if (isValueOperator(operator))
      levelsThatPass[level] = testValue(left, operator, rightValue);
    if (isListOperator(operator))
      levelsThatPass[level] = testList(left, operator, rightList);
    return levelsThatPass;
  }
}

const conditionalTypes = ["if", "or if"];
const resultTypes = ["then", "or else"];

function isResultRow(
  rowLevel: number,
  levelsThatPass: LevelsThatPass
): boolean {
  for (let rl = rowLevel; rl >= 0; rl--) {
    if (levelsThatPass[rl]) return true;
  }
  return false;
}

const valueOperators = ["===", "!==", ">", ">=", "<", "<="] as const;
type ValueOperator = typeof valueOperators[number];
function isValueOperator(value: string): value is ValueOperator {
  return listOperators.includes(value as any);
}

export const listOperators = ["is in", "isn't in"] as const;
type ListOperator = typeof listOperators[number];
function isListOperator(value: string): value is ListOperator {
  return listOperators.includes(value as any);
}

function testValue(
  leftSide: NumObj,
  operator: ValueOperator,
  rightSide: NumObj
) {
  function getTestString() {
    const { number: leftNumber } = leftSide;
    const { number: rightNumber } = rightSide;

    if ([leftNumber, rightNumber].some((n) => typeof n === "number"))
      return `return ${leftNumber}${operator}${rightNumber}`;

    if (["===", "!=="].includes(operator))
      return `return "${leftSide.editorText}"${operator}"${rightSide.editorText}"`;
  }

  const testString = getTestString();
  if (testString) return Function(testString)();
  else return false;
}
function testList(
  leftSide: NumObj,
  operator: ListOperator,
  rightSide: string[]
) {
  function getTestString() {
    if (typeof leftSide.number === "number") return `${leftSide.number}`;
    else return leftSide.editorText;
  }
  const testString = getTestString();
  const includes = rightSide.includes(testString);

  if (operator === "is in") return includes;
  else if (operator === "isn't in") return !includes;
  else throw new Error(`operator ${operator} isn't valid.`);
}

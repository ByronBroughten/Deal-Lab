import { NumObj } from "../../SectionsMeta/allBaseSectionVarbs/baseValues/NumObj";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarb } from "../../StateGetters/GetterVarb";

const conditionalTypes = ["if", "or if"] as const;
type ConditionalTypeName = typeof conditionalTypes[number];
const resultTypes = ["then", "or else"];
type ResultTypeName = typeof resultTypes[number];
export type ConditionalRowTypeName = ConditionalTypeName | ResultTypeName;

type LevelsThatPass = Record<number, boolean>;

export class ConditionalValueSolver extends GetterSectionBase<"conditionalRowList"> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  solveValue(): NumObj {
    const rows = this.get.children("conditionalRow");
    const levelsThatPass: LevelsThatPass = {};
    for (const row of rows) {
      const left = row.varb("left");
      const rightValue = row.varb("rightValue");
      const vals = row.varbs.values({
        type: "string",
        level: "number",
        operator: "string",
        rightList: "stringArray",
        then: "numObj",
      });
      const result = this.checkRow(
        {
          ...vals,
          left,
          rightValue,
        },
        levelsThatPass
      );
      if (result) return result;
    }
    throw new Error(
      "Something went wrong. Conditional logic yielded no value."
    );
  }
  private checkRow(
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
      left: GetterVarb<"conditionalRow">;
      operator: string;
      rightList: string[];
      rightValue: GetterVarb<"conditionalRow">;
      then: NumObj;
    },
    levelsThatPass: LevelsThatPass
  ): false | NumObj {
    if (conditionalTypes.includes(type as any)) {
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
      left: GetterVarb<"conditionalRow">;
      operator: string;
      rightList: string[];
      rightValue: GetterVarb<"conditionalRow">;
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

const logicOperators = [...valueOperators, ...listOperators] as const;
export type LogicOperator = typeof logicOperators[number];

function isResultRow(
  rowLevel: number,
  levelsThatPass: LevelsThatPass
): boolean {
  for (let rl = rowLevel; rl >= 0; rl--) {
    if (levelsThatPass[rl]) return true;
  }
  return false;
}

function testValue(
  leftSide: GetterVarb<"conditionalRow">,
  operator: ValueOperator,
  rightSide: GetterVarb<"conditionalRow">
) {
  function getTestString() {
    const { numberOrQuestionMark: leftNum } = leftSide;
    const { numberOrQuestionMark: rightNum } = rightSide;

    if ([leftNum, rightNum].some((n) => typeof n === "number"))
      return `return ${leftNum}${operator}${rightNum}`;

    if (["===", "!=="].includes(operator))
      return `return "${leftSide.value("numObj").mainText}"${operator}"${
        rightSide.value("numObj").mainText
      }"`;
  }

  const testString = getTestString();
  if (testString) return Function(testString)();
  else return false;
}

function testList(
  leftSide: GetterVarb<"conditionalRow">,
  operator: ListOperator,
  rightSide: string[]
) {
  function getTestString() {
    if (typeof leftSide.numberOrQuestionMark === "number")
      return `${leftSide.numberValue}`;
    else return leftSide.value("numObj").mainText;
  }
  const testString = getTestString();
  const includes = rightSide.includes(testString);

  if (operator === "is in") return includes;
  else if (operator === "isn't in") return !includes;
  else throw new Error(`operator ${operator} isn't valid.`);
}

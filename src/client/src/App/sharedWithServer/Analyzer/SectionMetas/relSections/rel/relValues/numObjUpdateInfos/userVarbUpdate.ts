import { NumObj } from "../../../baseSections/baseValues/NumObj";
import { updateInfo } from "../updateInfo";

export type ConditionalRowValues = {
  type: string;
  level: number;
  left: NumObj;
  operator: string;
  rightList: string[];
  rightValue: NumObj;
  then: NumObj;
};

type UserVarbUpdateProps = {
  editorOrRowValues: NumObj | ConditionalRowValues[];
};
export const userVarbUpdate = {
  info: updateInfo(
    "editorOrRowValues",
    ({ editorOrRowValues }: UserVarbUpdateProps) => {
      const levelsThatPass: LevelsThatPass = {};
      if (editorOrRowValues instanceof NumObj) return editorOrRowValues;
      for (const row of editorOrRowValues) {
        const result = checkRow(row, levelsThatPass);
        if (result) return result;
      }

      throw new Error(
        "Something went wrong. Conditional logic yielded no value."
      );
    }
  ),
  arrs: {
    valueOperator: ["===", "!==", ">", ">=", "<", "<="],
    listOperator: ["is in", "isn't in"],
    get logicOperator() {
      return [...this.valueOperator, ...this.listOperator];
    },
    conditionalType: ["if", "or if"],
    resultType: ["then", "or else"],
  },
  is<K extends keyof typeof this.arrs>(
    value: any,
    arrName: K
  ): value is typeof this.arrs[K][number] {
    const arr: readonly any[] = this.arrs[arrName];
    return arr.includes(value);
  },
} as const;

type UserVarbUpdate = typeof userVarbUpdate;
type UserVarbValue = {
  [Prop in keyof UserVarbUpdate["arrs"]]: UserVarbUpdate["arrs"][Prop][number];
};

function checkRow(
  {
    type,
    level,
    left,
    operator,
    rightList,
    rightValue,
    then,
  }: ConditionalRowValues,
  levelsThatPass: LevelsThatPass
): false | NumObj {
  if (userVarbUpdate.is(type, "conditionalType")) {
    if (type === "if" || !levelsThatPass[level])
      updateLevelsThatPass(levelsThatPass, {
        level,
        left,
        operator,
        rightList,
        rightValue,
      });
    return false;
  }
  if (userVarbUpdate.is(type, "resultType")) {
    if (type === "or else" || isResultRow(level, levelsThatPass)) return then;
    else return false;
  }
  throw new Error(`type "${type}" is invalid'`);
}

function isResultRow(
  rowLevel: number,
  levelsThatPass: LevelsThatPass
): boolean {
  for (let rl = rowLevel; rl >= 0; rl--) {
    if (levelsThatPass[rl]) return true;
  }
  return false;
}

type LevelsThatPass = Record<number, boolean>;
function updateLevelsThatPass(
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
  if (userVarbUpdate.is(operator, "valueOperator"))
    levelsThatPass[level] = testValue(left, operator, rightValue);
  if (userVarbUpdate.is(operator, "listOperator"))
    levelsThatPass[level] = testList(left, operator, rightList);
  return levelsThatPass;
}

function testValue(
  leftSide: NumObj,
  operator: UserVarbValue["valueOperator"],
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
  operator: UserVarbValue["listOperator"],
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

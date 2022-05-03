import { EditorState } from "draft-js";
import { getBlockAndOffset } from "../../../utils/DraftS";

const varbCalcRegEx = /[\d.*/+-]/;
const parsers = {
  //@ts-ignore
  charRegEx: ({ char, focusOffset, varb }) => {
    // this test applies only to normal input (not variable entities)
    let passed = true;
    if (!varb) {
      if (varbCalcRegEx.test(char)) {
      } else {
        console.log("failed charRegEx");
        console.log("focusOffset, char", focusOffset, char);
        passed = false;
      }
    }
    return passed;
  },
};

// only allows arithmatic symbols, numbers, dots, varbs
export default function varbCalcInputParser({
  char,
  editorState,
  varb = false,
}: {
  char: string;
  editorState: EditorState;
  varb?: boolean;
}) {
  const { block, focusOffset } = getBlockAndOffset(editorState);
  const { text, entityRanges } = block;

  const testParams: any = {
    char,
    text,
    textLength: text.length,
    entityRanges,
    focusOffset,
    varb,
  };

  let lastChar = null;
  const lastCharIdx = text.length - 1;

  for (const entity of entityRanges) {
    const entityEndIdx = entity.offset + entity.length - 1;
    if (entityEndIdx === lastCharIdx) lastChar = "var";
  }
  testParams.lastChar = lastChar === null ? text[lastCharIdx] : lastChar;

  for (const test of Object.values(parsers)) {
    //@ts-ignore
    if (!test(testParams)) return false;
  }
  return true;
}

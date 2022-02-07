import { EditorState } from "draft-js";
import { useState } from "react";
import { useEffect } from "react";
import { DraftBlock } from "../../utils/Draf";
import useOnChange from "./useOnChange";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import StateVarb, {
  StateValueAnyKey,
} from "../../sharedWithServer/Analyzer/StateSection/StateVarb";
import { FeVarbInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";

export const getEditorSolveParams = (rawEditorState: any) => {
  const { blocks, entityMap }: { blocks: DraftBlock[]; entityMap: any } =
    rawEditorState;
  const { text, entityRanges } = blocks[0];
  return { text, entityMap, entityRanges };
};
type CreateEditor = (props: {
  [key: string]: any;
  varb: StateVarb;
  editorState?: EditorState;
}) => EditorState;

export default function useDraftInput(
  feVarbInfo: FeVarbInfo,
  valueType: StateValueAnyKey,
  createEditor: CreateEditor = ({}) => EditorState.createEmpty()
) {
  const { analyzer } = useAnalyzerContext();
  const varb = analyzer.varb(feVarbInfo);

  const [editorState, setEditorState] = useState<EditorState>(
    createEditor({ varb })
  );

  useEffect(() => {
    if (varb.manualUpdateEditorToggle !== undefined) {
      setEditorState(createEditor({ varb }));
    }
  }, [varb.manualUpdateEditorToggle]);

  const value = varb.value(valueType);
  const onChange = useOnChange({
    feVarbInfo,
    editorState,
    setEditorState,
  });

  return {
    onChange,
    editorState,
    setEditorState,
    value,
    varb,
    analyzer,
  };
}

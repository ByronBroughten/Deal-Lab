import { EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import StateVarb, {
  StateValueAnyKey,
} from "../../sharedWithServer/Analyzer/StateSection/StateVarb";
import { FeVarbInfo } from "../../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { DraftBlock } from "../../utils/Draf";
import useOnChange from "./useOnChange";

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
  const { analyzer, handleUpdateFromEditor } = useAnalyzerContext();
  const varb = analyzer.varb(feVarbInfo);

  const [editorState, setEditorState] = useState<EditorState>(
    createEditor({ varb })
  );

  useEffect(() => {
    if (varb.manualUpdateEditorToggle !== undefined) {
      setEditorState(createEditor({ varb }));
    }
  }, [varb.manualUpdateEditorToggle]);

  const firstUpdate = React.useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleUpdateFromEditor({ feVarbInfo, editorState });
  }, [editorState]);

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

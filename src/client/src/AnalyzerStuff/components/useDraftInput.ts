import { EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import useOnChange from "../../App/components/inputs/useOnChange";
import { FeVarbInfo } from "../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { DraftBlock } from "../../App/utils/DraftS";
import StateVarb, {
  StateValueAnyKey,
} from "../modules/Analyzer/StateSection/StateVarb";
import { useAnalyzerContext } from "./usePropertyAnalyzer";

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

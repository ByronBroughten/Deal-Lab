import { ContentState, EditorState } from "draft-js";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { constants } from "../../../sharedWithServer/Constants";
import { FeVarbInfo } from "../../../sharedWithServer/SectionInfos/FeInfo";
import { isEditorValueName } from "../../../sharedWithServer/sectionVarbsConfig/StateValue/EditorValue";
import { StrictOmit } from "../../../sharedWithServer/utils/types";
import {
  CreateEditorProps,
  EditorUpdaterVarb,
} from "../../modules/EditorUpdaterVarb";
import { useAction } from "../../stateClassHooks/useAction";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";
import { SetEditorState } from "../../utils/DraftS";

interface UseDraftInputProps
  extends FeVarbInfo,
    StrictOmit<CreateEditorProps, "valueType"> {
  altUpdate?: AltUpdate;
  noSolve?: boolean;
}

export function useDraftInput(props: UseDraftInputProps): {
  editorState: EditorState;
  setEditorState: SetEditorState;
} {
  const varb = useGetterVarb(props);
  const { valueName } = varb;
  if (!isEditorValueName(valueName)) {
    throw new Error(`valueName "${valueName}" is not an editorValueName`);
  }

  const editorVarb = new EditorUpdaterVarb(varb.getterVarbProps);
  const [editorState, setEditorState] = useState<EditorState>(() =>
    editorVarb.createEditor({
      ...props,
      valueType: valueName,
    })
  );

  useUpdateValueFromEditor({
    ...varb.feVarbInfo,
    editorState,
    noSolve: props.noSolve,
  });

  useUpdateEditorFromValue({
    ...props,
    valueType: valueName,
    editorState,
    setEditorState,
    editorVarb,
  });

  return {
    editorState,
    setEditorState,
  };
}

interface UseUpdateEditorFromValueProps extends CreateEditorProps {
  editorState: EditorState;
  editorVarb: EditorUpdaterVarb;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}
function useUpdateEditorFromValue({
  editorState,
  editorVarb,
  setEditorState,
  ...rest
}: UseUpdateEditorFromValueProps) {
  const contentState = editorState.getCurrentContent();
  let contentIsUpdated = false;
  useEffect(() => {
    contentIsUpdated = true;
  }, [contentState]);

  const value = editorVarb.getterVarb.value();
  const strValue = JSON.stringify(value);
  useEffect(() => {
    const valueFromEditor = editorVarb.valueFromContentState(contentState);
    if (!contentIsUpdated && !isEqual(value, valueFromEditor)) {
      setEditorState(editorVarb.createEditor(rest));
    }
  }, [contentIsUpdated, strValue, contentState]);
}

interface AltUpdateProps extends Partial<FeVarbInfo> {
  contentState: ContentState;
}

type AltUpdate = (props: AltUpdateProps) => void;

interface Props extends FeVarbInfo {
  editorState: EditorState;
  altUpdate?: AltUpdate;
  noSolve?: boolean;
}
function useUpdateValueFromEditor({ editorState, altUpdate, ...rest }: Props) {
  const updateFromContent = useAction("updateValueFromContent");
  const contentState = editorState.getCurrentContent();
  const isFirstUpdateRef = React.useRef(true);
  const updateFn = altUpdate ?? updateFromContent;

  React.useEffect(() => {
    if (isFirstUpdateRef.current) {
      isFirstUpdateRef.current = false;
      return;
    }
    let timerFunc = setTimeout(
      () => updateFn({ contentState, ...rest }),
      constants.editorValueUpdateDelayMs
    );
    return () => clearTimeout(timerFunc);
  }, [contentState, updateFn]);
}

export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

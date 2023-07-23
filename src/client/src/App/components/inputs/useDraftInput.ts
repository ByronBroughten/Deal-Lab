import { ContentState, EditorState } from "draft-js";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { isEditorValueName } from "../../sharedWithServer/SectionsMeta/values/EditorValue";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useSetterVarb } from "../../sharedWithServer/stateClassHooks/useSetterVarb";
import { CreateEditorProps } from "../../sharedWithServer/StateSetters/EditorUpdaterVarb";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import { StrictOmit } from "../../sharedWithServer/utils/types";
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
  const setterVarb = useSetterVarb(props);
  const varb = setterVarb.get;
  const { valueName } = varb;
  if (!isEditorValueName(valueName)) {
    throw new Error(`valueName "${valueName}" is not an editorValueName`);
  }

  const [editorState, setEditorState] = useState<EditorState>(() =>
    setterVarb.createEditor({
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
    setterVarb,
  });

  return {
    editorState,
    setEditorState,
  };
}

interface UseUpdateEditorFromValueProps extends CreateEditorProps {
  editorState: EditorState;
  setterVarb: SetterVarb;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}
function useUpdateEditorFromValue({
  editorState,
  setterVarb,
  setEditorState,
  ...rest
}: UseUpdateEditorFromValueProps) {
  const contentState = editorState.getCurrentContent();
  let contentIsUpdated = false;
  useEffect(() => {
    contentIsUpdated = true;
  }, [contentState]);

  const value = setterVarb.get.value();
  const strValue = JSON.stringify(value);
  useEffect(() => {
    const valueFromEditor = setterVarb.valueFromContentState(contentState);
    if (!contentIsUpdated && !isEqual(value, valueFromEditor)) {
      setEditorState(setterVarb.createEditor(rest));
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
  useEffect(() => {
    if (isFirstUpdateRef.current) {
      isFirstUpdateRef.current = false;
      return;
    }
    updateFn({ contentState, ...rest });
  }, [contentState, updateFn]);
}

export interface VarbContentInfo extends FeVarbInfo {
  contentState: ContentState;
}

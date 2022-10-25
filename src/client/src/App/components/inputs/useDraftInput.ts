import { EditorState } from "draft-js";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useSectionsDispatch } from "../../sharedWithServer/stateClassHooks/useSections";
import { useSetterVarb } from "../../sharedWithServer/stateClassHooks/useSetterVarb";
import {
  CreateEditorProps,
  isEditorValueName,
} from "../../sharedWithServer/StateSetters/EditorUpdaterVarb";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import { StrictOmit } from "../../sharedWithServer/utils/types";

interface UseDraftInputProps
  extends FeVarbInfo,
    StrictOmit<CreateEditorProps, "valueType"> {}

export function useDraftInput(props: UseDraftInputProps) {
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
  });

  useUpdateEditorFromValue({
    ...props,
    valueType: valueName,
    editorState,
    setEditorState,
    setterVarb,
  });

  return {
    varb,
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
  useEffect(() => {
    const valueFromEditor = setterVarb.valueFromContentState(contentState);
    if (!contentIsUpdated && !isEqual(value, valueFromEditor)) {
      setEditorState(setterVarb.createEditor(rest));
    }
  }, [contentIsUpdated, JSON.stringify(value), contentState]);
}

interface Props extends FeVarbInfo {
  editorState: EditorState;
}
function useUpdateValueFromEditor({ editorState, ...rest }: Props) {
  const dispatch = useSectionsDispatch();
  const contentState = editorState.getCurrentContent();
  const isFirstUpdateRef = React.useRef(true);
  useEffect(() => {
    if (isFirstUpdateRef.current) {
      isFirstUpdateRef.current = false;
      return;
    }
    dispatch({ type: "updateValueFromContent", contentState, ...rest });
  }, [contentState]);
}

import { EditorState } from "draft-js";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useGetterVarb } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { useSetterVarb } from "../../sharedWithServer/stateClassHooks/useSetterVarb";
import { CreateEditorProps } from "../../sharedWithServer/StateSetters/EditorUpdaterVarb";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import useOnChange from "./useOnChange";

interface UseDraftInputProps extends FeVarbInfo, CreateEditorProps {}
export function useDraftInput(props: UseDraftInputProps) {
  const setterVarb = useSetterVarb(props);
  const [editorState, setEditorState] = useState<EditorState>(() =>
    setterVarb.createEditor(props)
  );

  useUpdateValueFromEditor({
    setterVarb,
    editorState,
  });

  useUpdateEditorFromValue({
    ...props,
    editorState,
    setEditorState,
    setterVarb,
  });

  const onChange = useOnChange({
    editorState,
    setEditorState,
  });

  const getterVarb = useGetterVarb(props);
  return {
    varb: getterVarb,
    editorState,
    onChange,
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
  const valueFromEditor = setterVarb.valueFromContentState(contentState);
  useEffect(() => {
    if (!contentIsUpdated && !isEqual(value, valueFromEditor)) {
      setEditorState(setterVarb.createEditor(rest));
    }
  }, [contentIsUpdated, value, valueFromEditor, contentState]);
}

type UseUpdateValueFromEditorProps = {
  editorState: EditorState;
  setterVarb: SetterVarb;
};
function useUpdateValueFromEditor({
  editorState,
  setterVarb,
}: UseUpdateValueFromEditorProps) {
  const contentState = editorState.getCurrentContent();
  const isFirstUpdateRef = React.useRef(true);
  useEffect(() => {
    if (isFirstUpdateRef.current) {
      isFirstUpdateRef.current = false;
      return;
    }
    setterVarb.updateValueFromEditor(contentState);
  }, [contentState]);
}

interface ManualUpdateIfTriggeredProps extends CreateEditorProps {
  setterVarb: SetterVarb;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}
function useManualUpdateIfTriggered({
  setterVarb,
  setEditorState,
  ...rest
}: ManualUpdateIfTriggeredProps): void {
  useEffect(() => {
    // toggle the manualUpdateEditorToggle to force updates;
    // the toggle initializes as undefined;
    if (setterVarb.manualUpdateEditorToggle !== undefined) {
      setEditorState(setterVarb.createEditor(rest));
    }
  }, [setterVarb.manualUpdateEditorToggle]);
}

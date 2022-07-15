import { EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useGetterVarb } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { useSetterVarb } from "../../sharedWithServer/stateClassHooks/useSetterVarb";
import { CreateEditorProps } from "../../sharedWithServer/StateSetters/EditorUpdaterVarb";
import { SetterVarb } from "../../sharedWithServer/StateSetters/SetterVarb";
import useOnChange from "./useOnChange";

interface UseDraftInputProps extends FeVarbInfo, CreateEditorProps {}
export function useDraftInputNext(props: UseDraftInputProps) {
  const setterVarb = useSetterVarb(props);
  const [editorState, setEditorState] = useState<EditorState>(() =>
    setterVarb.createEditor(props)
  );
  useManualUpdateIfTriggered({
    ...props,
    setterVarb,
    setEditorState,
  });
  useUpdateValueFromEditor({
    setterVarb,
    editorState,
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

// function useManualUpdateIfTriggered({
//   setterVarb,
//   setEditorState,
//   ...rest
// }: ManualUpdateIfTriggeredProps): void {
//   const { manualUpdateEditorToggle } = setterVarb;
//   const editorToggleRef = React.useRef(setterVarb.manualUpdateEditorToggle);
//   useEffect(() => {
//     if (
//       ![undefined, editorToggleRef.current].includes(manualUpdateEditorToggle)
//     ) {
//       setEditorState(setterVarb.createEditor(rest));
//       editorToggleRef.current = manualUpdateEditorToggle;
//     }
//   }, [manualUpdateEditorToggle, editorToggleRef, setterVarb, setEditorState]);
// }

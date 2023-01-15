import { EditorState } from "draft-js";
import React from "react";
import styled from "styled-components";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../modules/customHooks/useToggleView";
import { SetEditorState } from "../../modules/draftjs/draftUtils";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionInfoContextProvider } from "../../sharedWithServer/stateClassHooks/useSectionContext";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { EditorTextStatus } from "../../sharedWithServer/StateGetters/GetterVarbNumObj";
import theme from "../../theme/Theme";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
import NumObjVarbSelector from "./NumObjEditor/NumObjVarbSelector";
import {
  Adornments,
  getEntityEditorAdornments,
  PropAdornments,
} from "./NumObjEditor/useGetAdornments";
import { varSpanDecorator } from "./shared/EntitySpanWithError";
import { useDraftInput } from "./useDraftInput";

type Props = PropAdornments & {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  labeled?: boolean;
  bypassNumeric?: boolean;
  doEquals?: boolean;
};
const adornmentNames = ["startAdornment", "endAdornment"] as const;
export function NumObjEntityEditor({
  feVarbInfo,
  className,
  labeled = true,
  bypassNumeric = false,
  doEquals = true,
  label,
  ...props
}: Props) {
  let { editorState, setEditorState, varb } = useDraftInput({
    ...feVarbInfo,
    compositeDecorator: varSpanDecorator,
  });
  return (
    <MemoNumObjEntityEditor
      {...{
        displayValue: varb.displayValue,
        editorTextStatus: varb.numObj.editorTextStatus,
        displayName: varb.displayName,
        startAdornment: props.startAdornment ?? varb.startAdornment,
        endAdornment: props.endAdornment ?? varb.endAdornment,

        className,
        labeled,
        label,
        doEquals,
        bypassNumeric,

        editorState,
        setEditorState,
        ...varb.feVarbInfo,
      }}
    />
  );
}

interface MemoProps extends Adornments, FeVarbInfo {
  displayValue: string;
  editorTextStatus: EditorTextStatus;
  displayName: string;

  className?: string;
  labeled?: boolean;
  label?: string;
  doEquals: boolean;
  bypassNumeric: boolean;

  editorState: EditorState;
  setEditorState: SetEditorState;
}
const MemoNumObjEntityEditor = React.memo(function MemoNumObjEntityEditor({
  displayValue,
  className,
  labeled,
  displayName,
  setEditorState,
  editorState,
  bypassNumeric,
  ...rest
}: MemoProps) {
  const { startAdornment, endAdornment } = getEntityEditorAdornments({
    ...rest,
    displayValue,
  });

  const label = labeled ? rest.label ?? displayName : undefined;

  const { varbSelectorIsOpen, openVarbSelector, closeVarbSelector } =
    useToggleView({ viewWhat: "varbSelector", initValue: false });

  const numObjEditorRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  useOnOutsideClickEffect(closeVarbSelector, [numObjEditorRef, popperRef]);

  const handleBeforeInput = React.useCallback(
    (char: string): "handled" | "not-handled" => {
      // const numericRegEx = /^[0-9.-]*$/;
      const calculationRegEx = /[\d.*/+()-]/;
      if (calculationRegEx.test(char)) return "not-handled";
      return "handled";
    },
    []
  );

  return (
    <SectionInfoContextProvider {...rest}>
      <Styled
        ref={numObjEditorRef}
        className={`NumObjEditor-root ${className ?? ""}`}
      >
        <div className="NumObjEditor-inner">
          <MaterialDraftEditor
            onClick={openVarbSelector}
            onFocus={openVarbSelector}
            className={"NumObjEditor-materialDraftEditor"}
            id={GetterVarb.feVarbInfoToVarbId(rest)}
            {...{
              label,
              setEditorState,
              editorState,
              startAdornment,
              endAdornment,
              ...(!bypassNumeric && { handleBeforeInput }),
            }}
          />
          {varbSelectorIsOpen && (
            <NumObjVarbSelector {...{ setEditorState }} ref={popperRef} />
          )}
        </div>
      </Styled>
    </SectionInfoContextProvider>
  );
});

const Styled = styled.div`
  display: flex;
  align-items: center;
  .DraftTextField-root {
    min-width: 20px;
  }

  .NumObjEditor-calcPositioner {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: flex-end;
    width: 0;
    height: 100%;
    top: 11px;
  }

  .NumObjEditor-calcIconPositioner {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 3;
    width: 0;
    height: 100%;
  }

  .Calculator-root {
    position: absolute;
    background: ${theme["gray-300"]};
  }
`;

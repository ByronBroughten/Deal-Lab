import { EditorState } from "draft-js";
import React from "react";
import styled from "styled-components";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";
import { useToggleViewNext } from "../../modules/customHooks/useToggleView";
import { SetEditorState } from "../../modules/draftjs/draftUtils";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { VarbPathName } from "../../sharedWithServer/SectionsMeta/SectionInfo/VarbPathNameInfo";
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

type NumEditorType = "numeric" | "equation";

type Props = PropAdornments & {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  labeled?: boolean;
  bypassNumeric?: boolean;
  doEquals?: boolean;
  editorType?: NumEditorType;
  quickViewVarbNames?: VarbPathName[];
};

const seperator = ".";

export function NumObjEntityEditor({
  editorType = "numeric",
  feVarbInfo,
  className,
  labeled = true,
  bypassNumeric = false,
  doEquals = true,
  quickViewVarbNames = [],
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
        editorType,
        displayValue: varb.displayValue,
        editorTextStatus: varb.numObj.editorTextStatus,
        displayName: varb.displayName,
        startAdornment: props.startAdornment ?? varb.startAdornment,
        endAdornment: props.endAdornment ?? varb.endAdornment,
        quickViewVarbNameString: quickViewVarbNames.join(seperator),

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
  editorType: NumEditorType;
  quickViewVarbNameString: string;

  className?: string;
  labeled?: boolean;
  label?: string;
  doEquals: boolean;
  bypassNumeric: boolean;

  editorState: EditorState;
  setEditorState: SetEditorState;
}
const MemoNumObjEntityEditor = React.memo(function MemoNumObjEntityEditor({
  editorType,
  displayValue,
  className,
  labeled,
  displayName,
  setEditorState,
  editorState,
  bypassNumeric,
  quickViewVarbNameString,
  ...rest
}: MemoProps) {
  const { startAdornment, endAdornment } = getEntityEditorAdornments({
    ...rest,
    displayValue,
  });

  const label = labeled ? rest.label ?? displayName : undefined;

  const { varbSelectorIsOpen, openVarbSelector, closeVarbSelector } =
    useToggleViewNext("varbSelector", false);

  const numObjEditorRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  useOnOutsideClickEffect(closeVarbSelector, [numObjEditorRef, popperRef]);
  const clickAndFocus = onClickAndFocus(editorType, openVarbSelector);
  const handleBeforeInput = React.useCallback(
    (char: string): "handled" | "not-handled" => {
      const regEx = editorRegEx(editorType);
      if (regEx.test(char)) return "not-handled";
      return "handled";
    },
    []
  );
  const varbPathNames = quickViewVarbNameString.split(seperator);
  return (
    <SectionInfoContextProvider {...rest}>
      <Styled
        editorType={editorType}
        ref={numObjEditorRef}
        className={`NumObjEditor-root ${className ?? ""}`}
      >
        <div className="NumObjEditor-inner">
          <MaterialDraftEditor
            onClick={clickAndFocus}
            onFocus={clickAndFocus}
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

type OnClickAndFocus = (() => void) | undefined;

function onClickAndFocus(
  editorType: NumEditorType,
  fn: () => void
): OnClickAndFocus {
  if (editorType === "numeric") {
    return undefined;
  } else if (editorType === "equation") {
    return fn;
  }
}

function editorRegEx(editorType: NumEditorType): RegExp {
  const regEx: Record<NumEditorType, RegExp> = {
    numeric: /^[0-9.-]*$/,
    equation: /[\d.*/+()-]/,
  };
  return regEx[editorType];
}

const Styled = styled.div<{ editorType: NumEditorType }>`
  display: flex;
  align-items: center;

  .MaterialDraftEditor-wrapper {
    border-color: ${({ editorType }) =>
      editorType === "equation" && theme.primary.light};
  }

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

import { Box, SxProps } from "@mui/material";
import { EditorState } from "draft-js";
import React from "react";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { SetEditorState } from "../../modules/draftjs/draftUtils";
import { insertChars } from "../../modules/draftjs/insert";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionInfoContextProvider } from "../../sharedWithServer/stateClassHooks/useSectionContext";
import { ValueFixedVarbPathName } from "../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { EditorTextStatus } from "../../sharedWithServer/StateGetters/GetterVarbNumObj";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { useShowEqualsContext } from "../appWide/customContexts/showEquals";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
import { NumObjVarbSelector } from "./NumObjEditor/NumObjVarbSelector";
import {
  Adornments,
  getEntityEditorAdornments,
  PropAdornments,
} from "./NumObjEditor/useGetAdornments";
import { varSpanDecorator } from "./shared/EntitySpanWithError";
import { useDraftInput } from "./useDraftInput";

export type NumEditorType = "numeric" | "equation";

type Props = PropAdornments & {
  sx?: SxProps;
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  labeled?: boolean;
  bypassNumeric?: boolean;
  editorType?: NumEditorType;
  quickViewVarbNames?: ValueFixedVarbPathName[];
};

const seperator = ".";

export function NumObjEntityEditor({
  editorType = "numeric",
  feVarbInfo,
  className,
  labeled = true,
  bypassNumeric = false,
  quickViewVarbNames,
  label,
  sx,
  ...props
}: Props) {
  let { editorState, setEditorState, varb } = useDraftInput({
    ...feVarbInfo,
    compositeDecorator: varSpanDecorator,
  });

  const showEqualsStatus = useShowEqualsContext();
  const doEquals = showEqualsStatus === "showAll" ? true : varb.isPureUserVarb;

  return (
    <MemoNumObjEntityEditor
      {...{
        sx,
        editorType,
        displayValue: varb.displayValue,
        editorTextStatus: varb.numObj.editorTextStatus,
        displayName: varb.displayName,
        startAdornment: props.startAdornment ?? varb.startAdornment,
        endAdornment: props.endAdornment ?? varb.endAdornment,
        quickViewVarbNameString: quickViewVarbNames
          ? quickViewVarbNames.join(seperator)
          : undefined,

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
  sx?: SxProps;
  displayValue: string;
  editorTextStatus: EditorTextStatus;
  displayName: string;
  editorType: NumEditorType;
  quickViewVarbNameString?: string;

  className?: string;
  labeled?: boolean;
  label?: string;
  doEquals: boolean;
  bypassNumeric: boolean;

  editorState: EditorState;
  setEditorState: SetEditorState;
}
const MemoNumObjEntityEditor = React.memo(function MemoNumObjEntityEditor({
  sx,
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
    useToggleView("varbSelector", false);

  const numObjEditorRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  useOnOutsideClickEffect(closeVarbSelector, [numObjEditorRef, popperRef]);
  const clickAndFocus = onClickAndFocus(editorType, openVarbSelector);

  const regEx = /[\d.*/+()-]/;
  const reverseRegEx = /[^\d.*/+()-]/;
  const handleBeforeInput = React.useCallback(
    (char: string): "handled" | "not-handled" => {
      if (regEx.test(char)) return "not-handled";
      return "handled";
    },
    []
  );

  const handlePastedText = (text: string): "handled" => {
    text = text.replaceAll(new RegExp(reverseRegEx, "g"), "");
    setEditorState((editorState) => insertChars(editorState, text));
    return "handled";
  };

  return (
    <SectionInfoContextProvider {...rest}>
      <Box
        sx={[
          {
            flexDirection: "row",
            alignItems: "center",
            "& .NumObjVarbSelector-root": {
              top: -1,
            },
            "& .MaterialDraftEditor-wrapper": {
              borderColor:
                editorType === "equation"
                  ? nativeTheme.secondary.main
                  : nativeTheme["gray-300"],
            },
            "& .DraftTextField-root": {
              minWidth: 20,
            },
          },
          ...arrSx(sx),
        ]}
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
              ...(!bypassNumeric && { handlePastedText, handleBeforeInput }),
            }}
          />
          {varbSelectorIsOpen && (
            <NumObjVarbSelector
              {...{
                ...rest,
                setEditorState,
                varbPathNames: quickViewVarbNameString
                  ? (quickViewVarbNameString.split(
                      seperator
                    ) as ValueFixedVarbPathName[])
                  : undefined,
              }}
              ref={popperRef}
            />
          )}
        </div>
      </Box>
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
    // numeric: /^[0-9.-]*$/,
    equation: /[\d.*/+()-]/,
    get numeric() {
      return this.equation;
    },
  };
  return regEx[editorType];
}

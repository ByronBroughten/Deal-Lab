import { Box, SxProps } from "@mui/material";
import { EditorState } from "draft-js";
import React from "react";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { SetEditorState } from "../../modules/draftjs/draftUtils";
import { insertChars } from "../../modules/draftjs/insert";
import { VarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  FeVarbInfo,
  FeVI,
  SnVarbNames,
} from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useGetterVarb } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { SectionInfoContextProvider } from "../../sharedWithServer/stateClassHooks/useSectionContext";
import { ValueFixedVarbPathName } from "../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { EditorTextStatus } from "../../sharedWithServer/StateGetters/GetterVarbNumObj";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { VarbStringLabel } from "../appWide/VarbStringLabel";
import { useShowEqualsContext } from "../customContexts/showEquals";
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

type Props<
  SN extends SectionName = SectionName,
  LN extends SectionName = SectionName
> = PropAdornments & {
  sx?: SxProps;
  feVarbInfo: FeVI<SN>;
  className?: string;
  label?: any;
  labeled?: boolean;
  labelNames?: SnVarbNames<LN>;

  bypassNumeric?: boolean;
  editorType?: NumEditorType;
  quickViewVarbNames?: ValueFixedVarbPathName[];
  inputMargins?: boolean;
  hideVarbSelector?: boolean;
};

const seperator = ".";
export function NumObjEntityEditor<
  SN extends SectionName,
  LN extends SectionName
>({
  feVarbInfo,
  labelNames,
  label,
  labeled = true,
  className,
  editorType = "numeric",
  bypassNumeric = false,
  inputMargins = false,
  hideVarbSelector,
  quickViewVarbNames,
  sx,
  ...props
}: Props<SN, LN>) {
  let { editorState, setEditorState } = useDraftInput({
    ...feVarbInfo,
    compositeDecorator: varSpanDecorator,
  });

  const varb = useGetterVarb(feVarbInfo);

  const showEqualsStatus = useShowEqualsContext();
  const doEquals = showEqualsStatus === "showAll" ? true : varb.isPureUserVarb;
  const displayName = useDisplayName({
    labeled,
    label,
    labelNames,
    feVarbInfo,
  });
  return (
    <MemoNumObjEntityEditor
      {...{
        sx: {
          ...(inputMargins && {
            ...nativeTheme.editorMargins,
            "& .DraftTextField-labeled": {
              minWidth: 141,
            },
          }),
          ...sx,
        },
        inputMargins,
        editorType,
        displayValue: varb.displayValue,
        editorTextStatus: varb.numObj.editorTextStatus,
        displayName,
        startAdornment: props.startAdornment ?? varb.startAdornment,
        endAdornment: props.endAdornment ?? varb.endAdornment,
        quickViewVarbNameString: quickViewVarbNames
          ? quickViewVarbNames.join(seperator)
          : undefined,

        className,
        doEquals,
        bypassNumeric,

        editorState,
        setEditorState,
        ...varb.feVarbInfo,
      }}
    />
  );
}

interface UseLabelProps {
  labeled: boolean;
  label?: string;
  labelNames?: SnVarbNames;
  feVarbInfo: FeVarbInfo;
}
function useDisplayName({
  labeled,
  label,
  labelNames,
  feVarbInfo,
}: UseLabelProps): string | JSX.Element | undefined {
  const { sectionName, varbName } = feVarbInfo;
  const labelSn = labelNames?.sectionName;
  const labelVn = labelNames?.varbName;
  return React.useMemo(() => {
    if (!labeled) {
      return undefined;
    } else if (label) {
      return label;
    } else if (labelSn && labelVn) {
      return (
        <VarbStringLabel
          sx={{ marginTop: nativeTheme.s2 }}
          names={{
            sectionName: labelSn,
            varbName: labelVn as VarbName<typeof labelSn>,
          }}
        />
      );
    } else {
      return (
        <VarbStringLabel
          sx={{ marginTop: nativeTheme.s2 }}
          names={{
            sectionName,
            varbName: varbName as VarbName<typeof sectionName>,
          }}
        />
      );
    }
  }, [labeled, label, sectionName, varbName, labelSn, labelVn]);
}

interface MemoProps extends Adornments, FeVarbInfo {
  sx?: SxProps;
  displayValue: string;
  editorTextStatus: EditorTextStatus;
  editorType: NumEditorType;
  quickViewVarbNameString?: string;
  hideVarbSelector?: boolean;
  displayName: string | JSX.Element | undefined;

  inputMargins?: boolean;

  className?: string;
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
  displayName,
  setEditorState,
  editorState,
  bypassNumeric,
  quickViewVarbNameString,
  hideVarbSelector,
  inputMargins,
  ...rest
}: MemoProps) {
  const { startAdornment, endAdornment } = getEntityEditorAdornments({
    ...rest,
    displayValue,
  });

  const { varbSelectorIsOpen, openVarbSelector, closeVarbSelector } =
    useToggleView("varbSelector", false);

  const numObjEditorRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  useOnOutsideClickEffect(closeVarbSelector, [numObjEditorRef, popperRef]);
  const clickAndFocus = onClickAndFocus(editorType, openVarbSelector);

  const handleBeforeInput = React.useCallback(
    (char: string): "handled" | "not-handled" => {
      const regEx = /[\d.*/+()-]/;
      if (regEx.test(char)) return "not-handled";
      return "handled";
    },
    []
  );

  const quickViewVarbNames = quickViewVarbNameString
    ? (quickViewVarbNameString.split(seperator) as ValueFixedVarbPathName[])
    : undefined;

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
                  ? nativeTheme.darkBlue.light
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
              label: displayName,
              setEditorState,
              editorState,
              startAdornment,
              endAdornment,
              ...(!bypassNumeric && {
                handleBeforeInput,
                handlePastedText: makeHandlePastedText(setEditorState),
              }),
            }}
          />
          {!hideVarbSelector && varbSelectorIsOpen && (
            <NumObjVarbSelector
              {...{
                editorState,
                setEditorState,
                ...rest,
                varbPathNames: quickViewVarbNames,
                makeViewWindow: (props) => (
                  <SectionInfoContextProvider {...rest}>
                    <MaterialDraftEditor
                      sx={sx}
                      className={"NumObjEditor-materialDraftEditor"}
                      id={`${GetterVarb.feVarbInfoToVarbId(rest)}-modal`}
                      {...{
                        label: displayName,
                        setEditorState: props.setEditorState,
                        editorState: props.editorState,
                        startAdornment,
                        endAdornment,
                        ...(!bypassNumeric && {
                          handleBeforeInput,
                          handlePastedText: makeHandlePastedText(
                            props.setEditorState
                          ),
                        }),
                      }}
                    />
                  </SectionInfoContextProvider>
                ),
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

function makeHandlePastedText(setEditorState: SetEditorState) {
  return (text: string): "handled" => {
    const reverseRegEx = /[^\d.*/+()-]/;
    text = text.replaceAll(new RegExp(reverseRegEx, "g"), "");
    setEditorState((editorState) => insertChars(editorState, text));
    return "handled";
  };
}

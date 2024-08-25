import { Box, SxProps } from "@mui/material";
import { EditorState } from "draft-js";
import React from "react";
import { GetterVarb } from "../../../sharedWithServer/StateGetters/GetterVarb";
import { EditorTextStatus } from "../../../sharedWithServer/StateGetters/GetterVarbNumObj";
import {
  FeVarbInfo,
  FeVI,
} from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { ValueFixedVarbPathName } from "../../../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { SectionName } from "../../../sharedWithServer/stateSchemas/SectionName";
import { Obj } from "../../../sharedWithServer/utils/Obj";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { SetEditorState } from "../../modules/draftjs/draftUtils";
import { insertChars } from "../../modules/draftjs/insert";
import { useGetterSections } from "../../stateClassHooks/useGetterSections";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";
import { SectionInfoContextProvider } from "../../stateClassHooks/useSectionContext";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { VarbStringLabel } from "../appWide/VarbStringLabel";
import { useShowEqualsContext } from "../customContexts/showEquals";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
import { NumObjVarbSelector } from "./NumObjEditor/NumObjVarbSelector";
import { getEntityEditorAdornments } from "./NumObjEditor/useGetAdornments";
import { varSpanDecorator } from "./shared/EntitySpanWithError";
import { useDraftInput } from "./useDraftInput";

export type NumEditorType = "numeric" | "equation";

type LabelProp = string | JSX.Element;
export type LabelProps<LN extends SectionName = SectionName> = {
  showLabel?: boolean;
  labelInfo?: FeVI<LN>;
  label?: LabelProp;
  startAdornment?: LabelProp;
  endAdornment?: LabelProp;
};

type Props<
  SN extends SectionName = SectionName,
  LN extends SectionName = SectionName
> = {
  feVarbInfo: FeVI<SN>;
  labelProps?: LabelProps<LN>;
  className?: string;
  sx?: SxProps;
  editorType?: NumEditorType;
  bypassNumeric?: boolean;
  quickViewVarbNames?: readonly ValueFixedVarbPathName[];
  inputMargins?: boolean;
  hideVarbSelector?: boolean;
};

const seperator = ".";
export function NumObjEntityEditor<
  SN extends SectionName,
  LN extends SectionName
>({
  feVarbInfo,
  labelProps = {},
  editorType = "numeric",
  bypassNumeric = false,
  inputMargins = false,
  hideVarbSelector,
  quickViewVarbNames,
  className,
  sx,
}: Props<SN, LN>) {
  let { editorState, setEditorState } = useDraftInput({
    ...feVarbInfo,
    compositeDecorator: varSpanDecorator,
  });
  const varb = useGetterVarb(feVarbInfo);
  const showEqualsStatus = useShowEqualsContext();
  const doEquals = showEqualsStatus === "showAll" ? true : varb.isPureUserVarb;
  const labels = useLabels(feVarbInfo, labelProps);
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
        hideVarbSelector,
        displayValue: varb.displayValue,
        editorTextStatus: varb.numObj.editorTextStatus,
        quickViewVarbNameString: quickViewVarbNames
          ? quickViewVarbNames.join(seperator)
          : undefined,

        className,
        doEquals,
        bypassNumeric,
        editorState,
        setEditorState,
        ...labels,
        ...feVarbInfo,
      }}
    />
  );
}

type LabelName = "startAdornment" | "endAdornment" | "inputLabel";
type UseLabelProps = {
  labelName: LabelName;
  showLabel?: boolean;
  value?: LabelProp;
  labelInfo?: FeVarbInfo;
  varbInfo: FeVarbInfo;
};

function getLabel(labelName: LabelName, varb: GetterVarb): LabelProp {
  if (labelName !== "inputLabel") {
    return varb[labelName];
  } else {
    return (
      <VarbStringLabel
        sx={{ marginTop: nativeTheme.s2 }}
        names={varb.sectionVarbNames}
      />
    );
  }
}

function useLabel({
  labelName,
  showLabel = true,
  value,
  labelInfo,
  varbInfo,
}: UseLabelProps): LabelProp {
  const getters = useGetterSections();
  if (!showLabel && labelName === "inputLabel") {
    return "";
  } else if (value) {
    return value;
  } else if (labelInfo) {
    const varb = getters.varb(labelInfo);
    return getLabel(labelName, varb);
  } else {
    const varb = getters.varb(varbInfo);
    return getLabel(labelName, varb);
  }
}

function useLabels(
  varbInfo: FeVI,
  lps: LabelProps
): {
  label: LabelProp;
  startAdornment: LabelProp;
  endAdornment: LabelProp;
} {
  const labelProps = Obj.strictPick(lps, ["showLabel", "label", "labelInfo"]);
  const label = useLabel({
    labelName: "inputLabel",
    ...labelProps,
    value: lps.label,
    varbInfo,
  });
  const startAdornment = useLabel({
    labelName: "startAdornment",
    ...labelProps,
    value: lps.startAdornment,
    varbInfo,
  });
  const endAdornment = useLabel({
    labelName: "endAdornment",
    ...labelProps,
    value: lps.endAdornment,
    varbInfo,
  });
  return {
    label,
    startAdornment,
    endAdornment,
  };
}

interface MemoProps extends FeVarbInfo {
  sx?: SxProps;
  displayValue: string;
  label: LabelProp;
  startAdornment: LabelProp;
  endAdornment: LabelProp;
  editorTextStatus: EditorTextStatus;
  editorType: NumEditorType;
  quickViewVarbNameString?: string;
  hideVarbSelector?: boolean;
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
  label,
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
              label,
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
                        label,
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

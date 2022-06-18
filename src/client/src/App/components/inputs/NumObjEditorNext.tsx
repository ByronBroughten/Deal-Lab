import { pick } from "lodash";
import React from "react";
import styled from "styled-components";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../modules/customHooks/useToggleView";
import { VarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import theme from "../../theme/Theme";
import MaterialDraftEditor from "./MaterialDraftEditor";
import NumObjVarbSelector from "./NumObjEditor/NumObjVarbSelector";
import {
  PropAdornments,
  useGetAdornments,
} from "./NumObjEditor/useGetAdornments";
import { varSpanDecorator } from "./shared/VarSpanNext";
import { useDraftInputNext } from "./useDraftInputNext";

const numericRegEx = /^[0-9.-]*$/;
const calculationRegEx = /[\d.*/+()-]/;

type Props = PropAdornments & {
  feVarbInfo: VarbInfo;
  className?: string;
  label?: any;
  labeled?: boolean;
  bypassNumeric?: boolean;
};

export function NumObjEditorNext({
  feVarbInfo,
  className,
  labeled = true,
  bypassNumeric = false,
  ...props
}: Props) {
  let { editorState, varb, onChange } = useDraftInputNext({
    ...feVarbInfo,
    valueType: "numObj",
    compositeDecorator: varSpanDecorator,
  });

  const value = varb.value("numObj");

  const isCalcMode = true;
  const handleBeforeInput = (char: string): "handled" | "not-handled" => {
    const regEx = isCalcMode ? calculationRegEx : numericRegEx;
    if (regEx.test(char)) return "not-handled";
    return "handled";
  };

  // dipslay-related stuff
  const label = labeled ? props.label ?? varb.displayName : undefined;
  const adornmentNames = ["startAdornment", "endAdornment"] as const;

  const { startAdornment, endAdornment } = useGetAdornments({
    pAdornments: pick(props, adornmentNames),
    vAdornments: pick(varb.meta, adornmentNames),
    editorTextStatus: value.editorTextStatus,
    displayValue: varb.displayValue,
  });

  const { varbSelectorIsOpen, openVarbSelector, closeVarbSelector } =
    useToggleView({ viewWhat: "varbSelector", initValue: false });

  const numObjEditorRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  useOnOutsideClickEffect(closeVarbSelector, [numObjEditorRef, popperRef]);

  return (
    <Styled
      ref={numObjEditorRef}
      className={`NumObjEditor-root ${className ?? ""}`}
    >
      <div className="NumObjEditor-inner">
        <MaterialDraftEditor
          onClick={openVarbSelector}
          onFocus={openVarbSelector}
          label={label}
          className={"NumObjEditor-materialDraftEditor"}
          id={varb.varbId}
          editorProps={{
            editorState,
            handleReturn: () => "handled",
            handleOnChange: onChange,
            ...(!bypassNumeric && { handleBeforeInput }),
          }}
          shellProps={{
            startAdornment,
            endAdornment,
          }}
        />
        {varbSelectorIsOpen && (
          <NumObjVarbSelector {...{ onChange, editorState }} ref={popperRef} />
        )}
      </div>
    </Styled>
  );
}

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

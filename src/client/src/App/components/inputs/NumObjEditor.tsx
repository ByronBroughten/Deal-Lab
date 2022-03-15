import React from "react";
import { pick } from "lodash";
import styled from "styled-components";
import useDropped from "../../modules/customHooks/useDropped";
import { FeVarbInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import theme from "../../theme/Theme";
import MaterialDraftEditor from "./MaterialDraftEditor";
import createNumObjEditor from "./NumObjEditor/createNumObjEditor";
import useGetAdornments, {
  PropAdornments,
} from "./NumObjEditor/useGetAdornments";
import VarbCalculator from "./NumObjEditor/VarbCalculator";
import { varSpanDecorator } from "./shared/VarSpan";
import useDraftInput from "./useDraftInput";
import { useOnOutsideClickEffect } from "../../modules/customHooks/useOnOutsideClickRef";

const floatStuffRegEx = /^[0-9.-]*$/;
const varbCalcRegEx = /[\d.*/+()-]/;

type Props = PropAdornments & {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  labeled?: boolean;
  bypassNumeric?: boolean;
};

export default function NumObjEditor({
  feVarbInfo,
  className = "",
  labeled = true,
  bypassNumeric = false,
  ...props
}: Props) {
  let { editorState, varb, onChange } = useDraftInput(
    feVarbInfo,
    "numObj",
    ({ varb }) =>
      createNumObjEditor({
        varb,
        compositeDecorator: varSpanDecorator,
      })
  );
  const value = varb.value("numObj");

  const isCalcMode = true;
  const handleBeforeInput = (char: string): "handled" | "not-handled" => {
    const regEx = isCalcMode ? varbCalcRegEx : floatStuffRegEx;
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

  // I need to pass this ref to the same component to which I'm passing the onClick => focus()
  const { dropped, drop, unDropRef, unDrop } = useDropped();

  const numObjEditorRef = React.useRef<HTMLDivElement | null>(null);
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  useOnOutsideClickEffect(unDrop, [numObjEditorRef, popperRef]);

  // function onSelect(value: VariableOption) {
  //   const { displayName, varbInfo } = value;
  //   const entity: EntityMapData = {
  //     ...varbInfo,
  //     entityId: Analyzer.makeId(),
  //   };

  //   const newEditorState = insertEntity(editorState, displayName, entity);
  //   onChange(newEditorState);
  // }

  return (
    <Styled ref={numObjEditorRef}>
      <div className={"numeric-editor " + className}>
        <MaterialDraftEditor
          onClick={drop}
          onFocus={drop}
          label={label}
          className={"NumObjEditor-materialDraftEditor"}
          id={varb.fullName}
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
        {isCalcMode && dropped && (
          <VarbCalculator {...{ onChange, editorState }} />
        )}
      </div>
      {/* {isCalcMode && dropped && <Calculator {...{ onChange, editorState }} />} */}
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

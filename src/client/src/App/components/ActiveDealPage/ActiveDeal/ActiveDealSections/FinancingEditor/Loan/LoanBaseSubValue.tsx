import { SxProps } from "@mui/material";
import React from "react";
import { FeSectionInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StateValue } from "../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectEditor } from "../../../../../appWide/SelectEditor";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

type SName = SectionNameByType<"loanBaseSubValue">;
interface Props<SN extends SName> extends FeSectionInfo<SN> {
  sx?: SxProps;
  label?: React.ReactNode;
}
export function LoanBaseSubValue<SN extends SName>({
  sx,
  label,
  ...props
}: Props<SN>) {
  const updateValue = useAction("updateValue");
  const section = useGetterSection(props);
  const selectValue = section.valueNext("valueSourceName");
  const menuItems: [StateValue<"percentDollarsSource">, string][] = [
    ["offPercentEditor", "Down payment %"],
    ["offDollarsEditor", "Down payment $"],
    ["amountPercentEditor", `Loan amount %`],
    ["amountDollarsEditor", `Loan amount $`],
  ];
  return (
    <SelectEditor
      {...{
        sx,
        label,
        menuItems,
        selectValue,
        onChange: (e) => {
          updateValue({
            ...section.varbInfo("valueSourceName"),
            value: validateStateValue(e.target.value, "percentDollarsSource"),
          });
        },
        makeEditor: (editorProps) => (
          <NumObjEntityEditor
            {...{
              ...editorProps,
              feVarbInfo: {
                ...props,
                varbName: selectValue,
              },
            }}
          />
        ),
      }}
    />
  );
}

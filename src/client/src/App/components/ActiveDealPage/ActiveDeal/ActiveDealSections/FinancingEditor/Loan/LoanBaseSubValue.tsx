import { SxProps } from "@mui/material";
import React from "react";
import { FeSectionInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
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
  const section = useGetterSection(props);
  const selectValue = section.valueNext("valueSourceName");
  return (
    <SelectEditor
      {...{
        sx,
        unionValueName: "percentDollarsSource",
        feVarbInfo: {
          ...props,
          varbName: "valueSourceName",
        },
        items: [
          ["offPercentEditor", "Down payment %"],
          ["offDollarsEditor", "Down payment $"],
          ["amountPercentEditor", `Loan amount %`],
          ["amountDollarsEditor", `Loan amount $`],
        ],
        label,
        selectValue,
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

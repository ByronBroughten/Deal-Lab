import { SxProps } from "@mui/material";
import React from "react";
import { useGetterSection } from "../../../../../../../../modules/stateHooks/useGetterSection";
import { FeSectionInfo } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionNameByType } from "../../../../../../../../sharedWithServer/stateSchemas/schema6SectionChildren/SectionNameByType";
import { SelectEditor } from "../../../../../../appWide/SelectEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

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
          ["offPercentEditor", `Down payment percent`],
          ["offDollarsEditor", "Down payment dollars"],
          ["amountPercentEditor", `Loan amount percent`],
          ["amountDollarsEditor", `Loan amount dollars`],
        ],
        label,
        selectValue,
        makeEditor: (editorProps) => (
          <NumObjEntityEditor
            {...{
              ...editorProps,
              labelProps: { showLabel: false },
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

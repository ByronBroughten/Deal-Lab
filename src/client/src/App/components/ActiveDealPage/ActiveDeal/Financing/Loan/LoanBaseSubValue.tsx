import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectEditor } from "../../../../appWide/SelectEditor";
import { FeSectionInfo } from "./../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";

type SName = SectionNameByType<"loanBaseSubValue">;
interface Props<SN extends SName> extends FeSectionInfo<SN> {}
export function LoanBaseSubValue<SN extends SName>(props: Props<SN>) {
  const section = useGetterSection(props);
  const menuItems: [StateValue<"percentDollarsSource">, string][] = [
    ["offPercent", "Down payment %"],
    ["offDollars", "Down payment $"],
    ["amountPercent", `Loan amount %`],
    ["amountDollars", `Loan amount $`],
  ];
  return (
    <SelectEditor
      {...{
        menuItems,
        selectValue: section.valueNext("valueSourceName"),
      }}
    />
  );
}

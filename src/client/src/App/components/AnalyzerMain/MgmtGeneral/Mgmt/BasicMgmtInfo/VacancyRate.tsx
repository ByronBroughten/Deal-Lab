import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEditorNext } from "../../../../inputs/NumObjEditorNext";

type Props = { feId: string };
export default function VacancyRate({ feId }: Props) {
  const mgmt = useGetterSection({
    sectionName: "mgmt",
    feId,
  });

  const percentVarb = mgmt.varb("vacancyRatePercent");
  const dollarsVarb = mgmt.varb("vacancyLossDollarsMonthly");

  const { endAdornment } = percentVarb.meta;
  const dollarsValue = dollarsVarb.value("numObj");
  return (
    <NumObjEditorNext
      className="VacancyRate-root"
      label="Vacancy Rate"
      feVarbInfo={percentVarb.feVarbInfo}
      endAdornment={`${endAdornment} ${
        dollarsValue.number === "?" ? "" : `(${dollarsVarb.displayVarb()})`
      }`}
    />
  );
}

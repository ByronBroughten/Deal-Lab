import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string };
export default function VacancyRate({ feId }: Props) {
  const mgmt = useGetterSection({
    sectionName: "mgmt",
    feId,
  });

  const percentVarb = mgmt.varb("vacancyLossPercentEditor");
  const dollarsVarb = mgmt.varb("vacancyLossDollarsMonthly");

  const { endAdornment } = percentVarb.meta;
  return (
    <NumObjEntityEditor
      className="VacancyRate-root"
      label="Vacancy Rate"
      feVarbInfo={percentVarb.feVarbInfo}
      endAdornment={`${endAdornment} ${
        dollarsVarb.numberOrQuestionMark === "?"
          ? ""
          : `(${dollarsVarb.displayVarb()})`
      }`}
    />
  );
}

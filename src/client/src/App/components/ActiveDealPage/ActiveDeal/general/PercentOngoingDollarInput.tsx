import { VarbName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { PercentDollarInput } from "./PercentDollarInput";

interface Props<SN extends SectionName> extends FeSectionInfo<SN> {
  unitBaseName: string;
  ongoingBaseName: string;
  percentOfWhat: string;
  label: string;
  className?: string;
}
export function PercentOngoingDollarInput<SN extends SectionName>({
  ongoingBaseName,
  sectionName,
  feId,
  ...rest
}: Props<SN>) {
  const feInfo = { sectionName, feId } as const;
  const section = useGetterSection(feInfo);
  return (
    <PercentDollarInput
      {...{
        ...feInfo,
        ...rest,
        dollarVarbName: section.activeSwitchTargetName(
          ongoingBaseName,
          "ongoing"
        ) as VarbName<SN>,
      }}
    />
  );
}

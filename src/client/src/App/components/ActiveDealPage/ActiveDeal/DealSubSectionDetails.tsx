import { FeVarbInfo } from "../../../../sharedWithServer/SectionInfos/FeInfo";
import { LabeledVarbRow } from "../../appWide/LabeledVarbRow";

type Props = {
  displayName: React.ReactNode;
  detailVarbInfos: FeVarbInfo[];
};

export function DealSubSectionDetails({ displayName, detailVarbInfos }: Props) {
  return (
    <LabeledVarbRow
      {...{
        varbPropArr: detailVarbInfos,
      }}
    />
  );
}

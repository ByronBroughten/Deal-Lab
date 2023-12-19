import { FeVarbInfo } from "../../../../sharedWithServer/SectionInfo/FeInfo";
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

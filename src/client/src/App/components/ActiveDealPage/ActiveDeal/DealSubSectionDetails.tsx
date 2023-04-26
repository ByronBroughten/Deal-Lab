import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../appWide/LabeledVarbRow";

type Props = {
  displayName: React.ReactNode;
  detailVarbPropArr: LabeledVarbProps[];
};

export function DealSubSectionDetails({
  displayName,
  detailVarbPropArr,
}: Props) {
  return (
    <LabeledVarbRow
      {...{
        varbPropArr: detailVarbPropArr,
      }}
    />
  );
}

import { FeVarbInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { UpdateValueNextBtn } from "../../UpdateValueNextBtn";

interface Props extends FeVarbInfo {
  className?: string;
  nextSwitchValue: string;
}
export function NextBtnCell({ className, nextSwitchValue, ...rest }: Props) {
  return (
    <td className="VarbListItem-buttonCell">
      <UpdateValueNextBtn
        className="VarbListItem-nextBtn"
        {...{
          ...rest,
          value: nextSwitchValue,
        }}
      />
    </td>
  );
}

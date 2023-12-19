import { FeVarbInfo } from "../../../../../sharedWithServer/SectionInfo/FeInfo";
import { UpdateValueNextBtn } from "../../UpdateValueNextBtn";

interface Props extends FeVarbInfo {
  className?: string;
  nextSwitchValue: string;
}
export function NextBtnCell({ className, nextSwitchValue, ...rest }: Props) {
  return (
    <td className="VarbListItem-btnCell">
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

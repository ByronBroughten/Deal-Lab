import { FeVarbInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { ToggleValueCheckbox } from "../../ToggleValueCheckbox";

interface Props extends FeVarbInfo {
  className?: string;
}
export function CheckboxCell({ className, ...rest }: Props) {
  return (
    <td className="VarbListItem-btnCell">
      <ToggleValueCheckbox className="VarbListItem-checkbox" {...rest} />
    </td>
  );
}

import { StandardBtnProps } from "../general/StandardProps";
import { icons } from "../Icons";
import { StyledIconBtn } from "./StyledIconBtn";

type Props = StandardBtnProps;
export function EditSectionBtn(props: Props) {
  return (
    <StyledIconBtn
      className="MainSubSection-editBtn"
      left={icons.edit({ size: 20 })}
      middle="Edit"
      {...props}
    />
  );
}

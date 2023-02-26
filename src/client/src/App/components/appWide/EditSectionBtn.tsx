import { AiFillEdit } from "react-icons/ai";
import { StandardBtnProps } from "../general/StandardProps";
import { StyledIconBtn } from "./StyledIconBtn";

type Props = StandardBtnProps;
export function EditSectionBtn(props: Props) {
  return (
    <StyledIconBtn
      className="MainSubSection-editBtn"
      left={<AiFillEdit size={20} />}
      middle="Edit"
      {...props}
    />
  );
}

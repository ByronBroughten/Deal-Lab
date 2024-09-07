import { MuiBtnPropsNext } from "../../general/StandardProps";
import { icons } from "../Icons";
import { StyledActionBtn } from "./GeneralSection/MainSection/StyledActionBtn";

type Props = MuiBtnPropsNext;
export function EditSectionBtn(props: Props) {
  return (
    <StyledActionBtn left={icons.edit({ size: 20 })} middle="Edit" {...props} />
  );
}

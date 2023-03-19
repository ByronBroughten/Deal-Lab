import { IconBaseProps } from "react-icons";
import { AiFillEdit } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { BsFillHouseFill } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface IconProps extends IconBaseProps {}

type IconName = "property" | "buyAndHold" | "delete" | "edit" | "copy";
export const icons: Record<IconName, (props?: IconProps) => React.ReactNode> = {
  property(props) {
    return <BsFillHouseFill {...props} />;
  },
  buyAndHold(props) {
    return <FaHandHoldingUsd {...props} />;
  },

  edit(props) {
    return <AiFillEdit {...props} />;
  },
  copy(props) {
    return <BiCopy {...props} />;
  },
  delete(props) {
    return <MdDelete {...props} />;
  },
};

import { IconBaseProps } from "react-icons";
import { AiFillEdit } from "react-icons/ai";
import { BiCopy, BiHelpCircle } from "react-icons/bi";
import { BsFillHouseFill } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { MdDelete } from "react-icons/md";

interface IconProps extends IconBaseProps {}

type IconName =
  | "property"
  | "buyAndHold"
  | "delete"
  | "edit"
  | "copy"
  | "info"
  | "finish";
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
  info(props) {
    return <BiHelpCircle {...props} />;
  },
  finish(props) {
    return <ImCheckmark {...props} />;
  },
};

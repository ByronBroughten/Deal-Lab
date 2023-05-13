import { IconBaseProps } from "react-icons";
import { AiFillEdit, AiOutlinePlusSquare } from "react-icons/ai";
import { BiCopy, BiHelpCircle, BiHomeHeart } from "react-icons/bi";
import { BsFillHouseFill } from "react-icons/bs";
import { GiHouseKeys } from "react-icons/gi";
import { ImCheckmark } from "react-icons/im";
import { MdDelete, MdOutlineHomeRepairService } from "react-icons/md";

export interface IconProps extends IconBaseProps {}

type IconName =
  | "property"
  | "buyAndHold"
  | "fixAndFlip"
  | "homeBuyer"
  | "info"
  | "repair"
  | "delete"
  | "edit"
  | "copy"
  | "addUnit"
  | "finish";
export const icons: Record<IconName, (props?: IconProps) => React.ReactNode> = {
  property(props) {
    return <BsFillHouseFill {...props} />;
  },
  buyAndHold(props) {
    return <GiHouseKeys {...props} />;
  },
  fixAndFlip(props) {
    return <MdOutlineHomeRepairService {...props} />;
  },
  homeBuyer(props) {
    return <BiHomeHeart {...props} />;
  },
  repair(props) {
    return <MdOutlineHomeRepairService {...props} />;
  },
  addUnit(props) {
    return <AiOutlinePlusSquare {...props} />;
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

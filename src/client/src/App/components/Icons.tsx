import { IconBaseProps } from "react-icons";
import { AiFillEdit, AiOutlinePlusSquare } from "react-icons/ai";
import {
  BiArchiveIn,
  BiArchiveOut,
  BiCopy,
  BiHelpCircle,
  BiHomeHeart,
} from "react-icons/bi";
import {
  BsFillHouseAddFill,
  BsFillHouseFill,
  BsFillHousesFill,
  BsNutFill,
  BsSnow2,
} from "react-icons/bs";
import { GiHouseKeys } from "react-icons/gi";
import { HiOutlineVariable } from "react-icons/hi";
import { ImCheckmark } from "react-icons/im";
import { MdDelete, MdOutlineHomeRepairService } from "react-icons/md";

export interface IconProps extends IconBaseProps {}

type IconName =
  | "compareDeals"
  | "addDeal"
  | "property"
  | "buyAndHold"
  | "fixAndFlip"
  | "brrrr"
  | "homeBuyer"
  | "info"
  | "repair"
  | "delete"
  | "edit"
  | "copy"
  | "addUnit"
  | "finish"
  | "variable"
  | "unArchive"
  | "doArchive"
  | "dealComponents";
export const icons: Record<IconName, (props?: IconProps) => React.ReactNode> = {
  compareDeals(props) {
    return <BsFillHousesFill {...props} />;
  },
  addDeal(props) {
    return <BsFillHouseAddFill {...props} />;
  },
  dealComponents(props) {
    return <BsNutFill {...props} />;
  },
  unArchive(props) {
    return <BiArchiveOut {...props} />;
  },
  doArchive(props) {
    return <BiArchiveIn {...props} />;
  },
  variable(props) {
    return <HiOutlineVariable {...props} />;
  },
  property(props) {
    return <BsFillHouseFill {...props} />;
  },
  buyAndHold(props) {
    return <GiHouseKeys {...props} />;
  },
  fixAndFlip(props) {
    return <MdOutlineHomeRepairService {...props} />;
  },
  brrrr(props) {
    return <BsSnow2 {...props} />;
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

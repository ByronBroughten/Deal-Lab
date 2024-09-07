import { Box } from "@mui/material";
import logo from "../../pictures/logo500DealLab.png";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { useGoToPage } from "./customHooks/useGoToPage";

export function DealLabIconBtn() {
  const goToMain = useGoToPage("mainPage");
  return (
    <PlainIconBtn // with the DealLab logo, height was 40
      middle={<Box sx={{ height: 23 }} component="img" src={logo} />}
      onClick={goToMain}
    />
  );
}

import { Box } from "@mui/material";
import logo from "../../icons/logo500.png";
import { useGoToPage } from "./customHooks/useGoToPage";
import { PlainIconBtn } from "./general/PlainIconBtn";

export function DealLabIconBtn() {
  const goToMain = useGoToPage("mainPage");
  return (
    <PlainIconBtn
      middle={<Box sx={{ height: 40 }} component="img" src={logo} />}
      onClick={goToMain}
    />
  );
}

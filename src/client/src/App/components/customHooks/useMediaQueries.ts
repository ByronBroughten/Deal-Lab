import { useMediaQuery } from "@mui/material";

export function useIsDevices() {
  const isTabOrSmaller = useMediaQuery("(max-width:1024px)");
  const isPhone = useMediaQuery("(max-width:767px)");
  return {
    isDesktop: !isTabOrSmaller,
    isTab: isTabOrSmaller && !isPhone,
    isPhone,
  };
}

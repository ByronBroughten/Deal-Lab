import { Box } from "@mui/material";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { useInputModalWithContext } from "../Modals/InputModalProvider";
import { DealCompareDealSelectMenu } from "./DealCompareDealSelectMenu";

interface Props {
  dealCount: number;
}
export function AddCompareDealBtn({ dealCount }: Props) {
  const width = dealCount === 0 ? "100%" : nativeTheme.comparedDeal.width;

  const areNone = dealCount === 0;

  const text = areNone ? "Add Deals To Compare" : "+ Deal";
  const extraSx = areNone
    ? {}
    : {
        borderRadius: 0,
        borderTopRightRadius: nativeTheme.subSection.borderRadius,
        borderBottomRightRadius: nativeTheme.subSection.borderRadius,
      };

  const { setModal } = useInputModalWithContext();
  const openDealMenu = () =>
    setModal({
      title: "Select a deal to compare",
      children: <DealCompareDealSelectMenu closeMenu={() => setModal(null)} />,
    });
  return (
    <HollowBtn
      {...{
        middle: <Box sx={{ minWidth: 120 }}>{text}</Box>,
        onClick: openDealMenu,
        sx: {
          ...extraSx,
          ...nativeTheme.subSection.borderLines,
          fontSize: nativeTheme.fs24,
          width,
          minWidth: "100px",
          minHeight: 300,
          zIndex: -1,
        },
      }}
    />
  );
}

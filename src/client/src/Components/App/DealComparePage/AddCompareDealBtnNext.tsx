import { SxProps } from "@mui/material";
import { arrSx } from "../../../modules/utils/mui";
import { constants } from "../../../sharedWithServer/Constants";
import { nativeTheme } from "../../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { useInputModalWithContext } from "../Modals/InputModalProvider";
import { DealCompareDealSelectMenu } from "./DealCompareDealSelectMenu";

interface Props {
  dealCount: number;
  sx?: SxProps;
}
export function AddCompareDealBtnNext({ dealCount, sx }: Props) {
  const width = "100px";

  const areNone = dealCount === 0;
  const text = areNone
    ? `Add ${constants.appUnitPlural} To Compare`
    : `+ ${constants.appUnit}`;

  const { setModal } = useInputModalWithContext();
  const openDealMenu = () =>
    setModal({
      title: "Select a deal to compare",
      children: <DealCompareDealSelectMenu closeMenu={() => setModal(null)} />,
    });
  return (
    <HollowBtn
      {...{
        middle: text,
        onClick: openDealMenu,
        sx: [
          {
            ...nativeTheme.subSection.borderLines,
            borderRadius: nativeTheme.muiBr0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            fontSize: nativeTheme.fs24,
            width: 300,
            minHeight: 55,
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}

import { SxProps } from "@mui/material";
import { FeIdProp } from "../../../sharedWithServer/SectionInfos/NanoIdInfo";
import { useAction } from "../../stateClassHooks/useAction";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { XBtn } from "../appWide/Xbtn";

interface Props extends FeIdProp {
  sx?: SxProps;
}
export function CompareDealRmBtn({ sx, feId }: Props) {
  return <DealCompareRmBtnStyled {...{ sx, onClick: () => {} }} />;
}

interface RmValProps extends FeIdProp {
  sx?: SxProps;
}
export function DealCompareRmValueBtn({ sx, feId }: RmValProps) {
  const removeSelf = useAction("removeSelf");
  return (
    <DealCompareRmBtnStyled
      {...{
        onClick: () => removeSelf({ sectionName: "outputItem", feId }),
        sx: [
          {
            borderRadius: 0,
            borderBottomWidth: 0,
            borderRightWidth: 0,
            height: nativeTheme.comparedDealValue.height,
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}

type StyledProps = { onClick: () => void; sx?: SxProps };
function DealCompareRmBtnStyled({ sx, ...rest }: StyledProps) {
  return (
    <XBtn
      {...{
        ...rest,
        sx: [
          {
            backgroundColor: nativeTheme.light,
            borderRadius: nativeTheme.muiBr0,
            ...nativeTheme.subSection.borderLines,
            "&:hover": {
              borderColor: nativeTheme.notice.light,
              backgroundColor: nativeTheme.notice.main,
              color: nativeTheme.light,
            },
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}

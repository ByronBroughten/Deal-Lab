import { SxProps } from "@mui/material";
import React from "react";
import { useWindowDimensions } from "react-native";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { arrSx } from "../../../../../utils/mui";
import MainSectionBody from "../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionInner } from "../../../../appWide/GeneralSection/MainSectionInner";
import { MainSectionTopRows } from "../../../../appWide/MainSectionTopRows";
import { LoanBaseValue } from "./Loan/LoanBaseValue";
import { LoanTerms } from "./Loan/LoanTerms";

export function Loan({
  feId,
  className,
  showXBtn,
  sx,
  showTitleAppend,
}: {
  sx?: SxProps;
  feId: string;
  className?: string;
  showXBtn: boolean;
  showTitleAppend?: boolean;
}) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;

  const loan = useGetterSection(feInfo);
  const financingMode = loan.valueNext("financingMode");
  const titleAppends: Record<StateValue<"financingMode">, string> = {
    purchase: "Purchase",
    refinance: "Refinance",
  };

  const dimensions = useWindowDimensions();
  const { mediaPhone, s5, s15 } = nativeTheme;
  const paddingLR = dimensions.width > mediaPhone ? s5 : s15;

  return (
    <MainSectionInner
      className={className}
      sx={[
        {
          paddingTop: nativeTheme.s45,
          paddingLeft: paddingLR,
          paddingRight: paddingLR,
          "& .MainSectionTopRows-xBtn": {
            visibility: "hidden",
          },
          "&:hover": {
            "& .MainSectionTopRows-xBtn": {
              visibility: "visible",
            },
          },
        },
        ...arrSx(sx),
      ]}
    >
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Loan",
          titleAppend: showTitleAppend && titleAppends[financingMode],
          showXBtn,
        }}
      />
      <MainSectionBody themeName="loan">
        <LoanBaseValue feId={loan.onlyChildFeId("loanBaseValue")} />
        <LoanTerms feId={loan.feId} />
      </MainSectionBody>
    </MainSectionInner>
  );
}

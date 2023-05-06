import React from "react";
import { useWindowDimensions } from "react-native";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import MainSectionBody from "../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionInner } from "../../../../appWide/GeneralSection/MainSectionInner";
import { MainSectionTopRows } from "../../../../appWide/MainSectionTopRows";
import { LoanBaseValue } from "./Loan/LoanBaseValue";
import { LoanTerms } from "./Loan/LoanTerms";

export function Loan({
  feId,
  className,
  showXBtn,
}: {
  feId: string;
  className?: string;
  showXBtn: boolean;
}) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;

  const loan = useGetterSection(feInfo);

  const dimensions = useWindowDimensions();
  const { mediaPhone, s5, s15 } = nativeTheme;
  const paddingLR = dimensions.width > mediaPhone ? s5 : s15;

  return (
    <MainSectionInner
      className={className}
      sx={{
        paddingTop: nativeTheme.s45,
        paddingLeft: paddingLR,
        paddingRight: paddingLR,
        "& .MainSectionTopRows-xBtn": {
          visibility: "hidden",
        },
        "& :hover": {
          "& .MainSectionTopRows-xBtn": {
            visibility: "visible",
          },
        },
      }}
    >
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Loan",
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

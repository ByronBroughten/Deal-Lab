import { SxProps } from "@mui/material";
import React from "react";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { arrSx } from "../../../../../utils/mui";
import MainSectionBody from "../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionInner } from "../../../../appWide/GeneralSection/MainSectionInner";
import { MainSectionTopRows } from "../../../../appWide/MainSectionTopRows";
import { useIsDevices } from "./../../../../customHooks/useMediaQueries";
import { LoanBaseValue } from "./Loan/LoanBaseValue";
import { LoanCosts } from "./Loan/LoanCosts";
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

  const { isPhone } = useIsDevices();
  const { s5, s15 } = nativeTheme;
  const paddingLR = isPhone ? s15 : s5;
  const minWidth = isPhone ? "auto" : "650px";
  return (
    <MainSectionInner
      className={className}
      sx={[
        {
          minWidth,
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
          showXBtn,
          ...(showTitleAppend && { titleAppend: titleAppends[financingMode] }),
        }}
      />
      <MainSectionBody themeName="loan">
        <LoanBaseValue feId={loan.onlyChildFeId("loanBaseValue")} />
        <LoanTerms feId={loan.feId} />
        <LoanCosts feId={loan.feId} />
      </MainSectionBody>
    </MainSectionInner>
  );
}

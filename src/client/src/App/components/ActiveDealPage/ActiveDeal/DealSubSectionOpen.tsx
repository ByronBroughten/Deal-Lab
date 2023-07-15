import React from "react";
import { nativeTheme } from "../../../theme/nativeTheme";
import { BackBtnWrapper } from "../../appWide/BackBtnWrapper";
import { FormSection } from "../../appWide/FormSection";
import { useGoToPage } from "../../customHooks/useGoToPage";
import { FinishBtn } from "./FinishBtn";
import { SubSectionOpen } from "./SubSectionOpen";

type Props = {
  children: React.ReactNode;
  finishIsAllowed?: boolean;
};

export function DealSubSectionOpen({ children, finishIsAllowed }: Props) {
  const goToActiveDeal = useGoToPage("activeDeal");
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <SubSectionOpen>
        {children}
        <FormSection sx={{ border: "none" }}>
          <FinishBtn
            sx={{
              boxShadow: "none",
              border: `1px solid ${nativeTheme["gray-400"]}`,
              marginTop: nativeTheme.s3,
            }}
            onClick={goToActiveDeal}
            btnText="Finish"
          />
        </FormSection>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}

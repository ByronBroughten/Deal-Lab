import React from "react";
import { useNavigate } from "react-router-dom";
import { constants } from "../../../Constants";
import { nativeTheme } from "../../../theme/nativeTheme";
import { BackBtnWrapper } from "../../appWide/BackBtnWrapper";
import { FormSection } from "../../appWide/FormSection";
import { FinishBtn } from "./FinishBtn";
import { SubSectionOpen } from "./SubSectionOpen";

type Props = {
  children: React.ReactNode;
  finishIsAllowed?: boolean;
};

export function DealSubSectionOpen({ children, finishIsAllowed }: Props) {
  const navigate = useNavigate();
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <SubSectionOpen>
        {children}
        <FormSection>
          <FinishBtn
            sx={{
              boxShadow: "none",
              border: `1px solid ${nativeTheme["gray-400"]}`,
            }}
            onClick={() => navigate(constants.feRoutes.activeDeal)}
            btnText="Finish"
          />
        </FormSection>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}

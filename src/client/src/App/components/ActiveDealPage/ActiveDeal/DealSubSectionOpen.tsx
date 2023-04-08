import React from "react";
import { useNavigate } from "react-router-dom";
import { constants } from "../../../Constants";
import { BackBtnWrapper } from "../../appWide/BackBtnWrapper";
import { FormSection } from "../../appWide/FormSection";
import { FinishBtn } from "./FinishBtn";
import { SubSectionOpen } from "./SubSectionOpen";

type Props = {
  children: React.ReactNode;
  finishIsAllowed: boolean;
};

export function DealSubSectionOpen({ children, finishIsAllowed }: Props) {
  const navigate = useNavigate();
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <SubSectionOpen>
        {children}
        <FormSection>
          <FinishBtn
            onClick={() => navigate(constants.feRoutes.activeDeal)}
            styleDisabled={!finishIsAllowed}
            className="MainSubSection-finishBtn"
            btnText="Finish"
            warningText="Please fill in all the required fields"
          />
        </FormSection>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}
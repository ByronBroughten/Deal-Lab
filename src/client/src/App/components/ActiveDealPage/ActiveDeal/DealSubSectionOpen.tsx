import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { constants } from "../../../Constants";
import { FormSection } from "../../appWide/FormSection";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import { FinishBtn } from "./FinishBtn";

type Props = {
  children: React.ReactNode;
  finishIsAllowed: boolean;
};

export function DealSubSectionOpen({ children, finishIsAllowed }: Props) {
  const navigate = useNavigate();
  return (
    <Styled>
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
    </Styled>
  );
}

const Styled = styled(MainSection)``;

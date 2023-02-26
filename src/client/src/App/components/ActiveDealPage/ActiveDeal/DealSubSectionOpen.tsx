import React from "react";
import styled from "styled-components";
import { constants } from "../../../Constants";
import { FormSection } from "../../appWide/FormSection";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import { FinishBtn } from "./FinishBtn";
import { DomLink } from "./general/DomLink";

type Props = {
  children: React.ReactNode;
  finishIsAllowed: boolean;
};

export function DealSubSectionOpen({ children, finishIsAllowed }: Props) {
  return (
    <Styled>
      {children}
      <FormSection>
        <DomLink to={finishIsAllowed ? constants.feRoutes.activeDeal : ""}>
          <FinishBtn
            styleDisabled={!finishIsAllowed}
            className="MainSubSection-finishBtn"
            btnText="Finish"
            warningText="Please fill in all the required fields"
          />
        </DomLink>
      </FormSection>
    </Styled>
  );
}

const Styled = styled(MainSection)``;

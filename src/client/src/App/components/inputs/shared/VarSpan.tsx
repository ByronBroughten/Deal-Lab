import React from "react";
import theme from "../../../theme/Theme";
import { CompositeDecorator } from "draft-js";
import { lighten } from "polished";
import styled, { css } from "styled-components";
import { getEntityStrategy } from "../../../modules/draftjs/getEntityStrategies";
import BasicDraftSpan from "./BasicDraftSpan";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { EntityMapData } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";

export const varSpanDecorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("IMMUTABLE"),
    component: VarSpan,
  },
]);

export default function VarSpan(draftProps: any) {
  const draftEntity = draftProps.contentState.getEntity(draftProps.entityKey);
  const entityData: EntityMapData = draftEntity.getData();

  const { analyzer } = useAnalyzerContext();
  const markDeleted = !analyzer.hasSection(entityData);
  return <Styled {...{ markDeleted }}>{draftProps.children}</Styled>;
}

const Styled = styled(BasicDraftSpan)<{ markDeleted: boolean }>`
  ${({ markDeleted }) =>
    markDeleted &&
    css`
      background-color: ${lighten(0.33, theme.danger)};
    `}
`;

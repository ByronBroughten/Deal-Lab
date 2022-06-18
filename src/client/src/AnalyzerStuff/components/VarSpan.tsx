import { CompositeDecorator } from "draft-js";
import { lighten } from "polished";
import React from "react";
import styled, { css } from "styled-components";
import BasicDraftSpan from "../../App/components/inputs/shared/BasicDraftSpan";
import { getEntityStrategy } from "../../App/modules/draftjs/getEntityStrategies";
import { EntityMapData } from "../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import theme from "../../App/theme/Theme";
import { useAnalyzerContext } from "./usePropertyAnalyzer";

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

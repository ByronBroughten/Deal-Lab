import { CompositeDecorator } from "draft-js";
import { lighten } from "polished";
import React from "react";
import styled, { css } from "styled-components";
import { getEntityStrategy } from "../../../modules/draftjs/getEntityStrategies";
import { EntityMapData } from "../../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseValues/entities";
import theme from "../../../theme/Theme";
import { useGetterSectionContext } from "./../../../sharedWithServer/stateClassHooks/useGetterSection";
import { EntitySpanBasic } from "./EntitySpanBasic";

export const varSpanDecorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("IMMUTABLE"),
    component: EntitySpan,
  },
]);

export function EntitySpan(draftProps: any) {
  const draftEntity = draftProps.contentState.getEntity(draftProps.entityKey);
  const entityData: EntityMapData = draftEntity.getData();
  const section = useGetterSectionContext();
  const markDeleted = !section.hasSectionByFocalMixed(entityData);
  return <Styled {...{ markDeleted }}>{draftProps.children}</Styled>;
}

const Styled = styled(EntitySpanBasic)<{ markDeleted: boolean }>`
  ${({ markDeleted }) =>
    markDeleted &&
    css`
      background-color: ${lighten(0.33, theme.danger)};
    `}
`;

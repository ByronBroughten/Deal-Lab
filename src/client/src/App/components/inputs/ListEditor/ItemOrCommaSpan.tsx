import { darken, lighten } from "polished";
import React from "react";
import styled from "styled-components";
import { EntitySpanBasic } from "../shared/EntitySpanBasic";

export const ItemSpan = styled(EntitySpanBasic)`
  margin: 0;
  padding: 0;
  border-radius: 0;
  background-color: ${(props) => darken(0.15, props.theme.info)};
  color: ${(props) => lighten(0.45, props.theme.info)};
`;

export const CommaSpan = styled.span`
  font-size: 200%;
  line-height: 0;
  color: ${(props) => props.theme.secondary};
`;
// check if we're dealing with a comma or with something else
export default function ItemOrCommaSpan(props: any) {
  const text = props.children[0].props.text;
  let ReturnSpan = ItemSpan;
  if (text === ",") {
    ReturnSpan = CommaSpan;
  }
  return <ReturnSpan>{props.children}</ReturnSpan>;
}

import styled from "styled-components";
import { ListMenuGeneric, ListMenuGenericProps } from "./ListMenuGeneric";

type Props = ListMenuGenericProps;
export function ListMenuFull({ className, ...rest }: Props) {
  return (
    <Styled {...{ ...rest, className: `ListMenuFull-root ${className}` }} />
  );
}

const Styled = styled(ListMenuGeneric)``;

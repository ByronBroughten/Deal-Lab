import React from "react";
import styled from "styled-components";
import { CheckboxLabeled } from "../../../../../general/CheckboxLabeled";

type Props = { className?: string; checkboxProps: ItemProps[] };
export function CheckboxList({ className, checkboxProps }: Props) {
  return (
    <Styled className={`CheckboxList-root ${className ?? ""}`}>
      {checkboxProps.map((props) => (
        <CheckboxLabeled
          {...{
            className: "CheckboxList-checkBox",
            key: props.name,
            ...props,
          }}
        />
      ))}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 480px;
  .CheckboxList-checkBox {
    width: 160px;
    white-space: nowrap;
  }
`;

type ItemProps = {
  checked: boolean;
  onChange: () => void;
  name: string;
  label?: React.ReactNode;
};

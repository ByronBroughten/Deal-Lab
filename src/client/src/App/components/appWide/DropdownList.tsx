import React from "react";
import styled, { css } from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../modules/customHooks/useToggleView";
import { DropdownBtn } from "./DropdownBtn";

interface Props {
  children?: React.ReactNode;
  title: string;
  className?: string;
  dropTop?: boolean;
  icon?: React.ReactNode;
}

export function DropdownList({
  children,
  title,
  className,
  dropTop,
  icon,
}: Props) {
  const { toggleList, closeList, listIsOpen } = useToggleView({
    initValue: false,
    viewWhat: "list",
  });

  const listRef = useOnOutsideClickRef(closeList);
  return (
    <Styled
      {...{
        ref: listRef,
        className: "DropdownList-root " + className ?? "",
        $dropTop: dropTop,
      }}
    >
      {dropTop && listIsOpen && (
        <div className="DropdownList-childrenOuter">
          <div className="DropdownList-childrenInner">{children}</div>
        </div>
      )}
      <DropdownBtn
        {...{
          isDropped: listIsOpen,
          toggleDropped: toggleList,
          title,
          icon,
        }}
      />

      {!dropTop && listIsOpen && (
        <div className="DropdownList-childrenOuter">
          <div className="DropdownList-childrenInner">{children}</div>
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div<{ $dropTop?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .DropdownList-childrenOuter {
    position: relative;
    display: flex;
    justify-content: flex-start;
    z-index: 4;
  }
  .DropdownList-childrenInner {
    position: absolute;
    ${({ $dropTop }) =>
      $dropTop &&
      css`
        bottom: 100%;
      `}
  }
`;

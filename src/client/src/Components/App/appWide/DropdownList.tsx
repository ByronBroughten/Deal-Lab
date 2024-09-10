import React from "react";
import styled, { css } from "styled-components";
import useOnOutsideClickRef from "../../../modules/utilityHooks/useOnOutsideClickRef";
import { useToggleView } from "../../../modules/utilityHooks/useToggleView";
import theme from "../../../theme/Theme";
import { DropdownBtn } from "./DropdownBtn";

interface Props {
  children?: React.ReactNode;
  title: string;
  className?: string;
  dropTop?: boolean;
  icon?: React.ReactNode;
  controller?: {
    toggleList: () => void;
    closeList: () => void;
    listIsOpen: boolean;
  };
}

export function DropdownList({
  children,
  title,
  className,
  dropTop,
  icon,
  controller,
}: Props) {
  const internalController = useToggleView("list", false);

  const control = controller ?? internalController;
  const listRef = useOnOutsideClickRef(control.closeList);
  return (
    <Styled
      {...{
        ref: listRef,
        className: "DropdownList-root " + className ?? "",
        $dropTop: dropTop,
      }}
    >
      {dropTop && control.listIsOpen && (
        <div className="DropdownList-childrenOuter">
          <div className="DropdownList-childrenInner">{children}</div>
        </div>
      )}
      <DropdownBtn
        {...{
          className: "DropdownList-dropDownBtn",
          isDropped: control.listIsOpen,
          toggleDropped: control.toggleList,
          title,
          icon,
        }}
      />

      {!dropTop && control.listIsOpen && (
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
    display: flex;
    flex-direction: column;
    padding-right: ${theme.s2};
    ${({ $dropTop }) =>
      $dropTop &&
      css`
        bottom: 100%;
      `}
  }
`;

import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import theme from "../../theme/Theme";
import { EditSectionBtn } from "./EditSectionBtn";
import { ModalSection } from "./ModalSection";
import { SelectEditor, SelectEditorProps } from "./SelectEditor";

export interface SelectAndItemizeEditorProps extends SelectEditorProps {
  total: string;
  itemizeValue: string;
  itemsComponent: React.ReactNode;
  itemizedModalTitle: string;
}

export function SelectAndItemizeEditor({
  className,
  total,
  itemsComponent,
  onChange,
  rightOfControls,
  itemizeValue,
  itemizedModalTitle,
  ...rest
}: SelectAndItemizeEditorProps) {
  const { itemsIsOpen, closeItems, openItems } = useToggleView("items", false);

  const isItemized = rest.selectValue === itemizeValue;
  return (
    <Styled className={`SelectAndItemizeEditor ${className ?? ""}`}>
      <SelectEditor
        {...{
          onChange: (e, ...args) => {
            unstable_batchedUpdates(() => {
              onChange && onChange(e, ...args);
              e.target.value === itemizeValue && openItems();
            });
          },
          ...rest,
          rightOfControls,
        }}
      />
      {rightOfControls
        ? null
        : isItemized && (
            <>
              <div className="SelectAndItemizeEditor-itemizedTotalDiv">{`Total = ${total}`}</div>
              <EditSectionBtn
                className="SelectAndItemizeEditor-editBtn"
                onClick={openItems}
              />
              <ModalSection
                title={itemizedModalTitle}
                closeModal={closeItems}
                show={itemsIsOpen}
              >
                {itemsComponent}
              </ModalSection>
            </>
          )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .SelectAndItemizeEditor-itemizedTotalDiv {
    margin-left: ${theme.s3};
    display: flex;
    align-items: center;
  }
  .SelectAndItemizeEditor-editBtn {
    margin-left: ${theme.s2};
  }
`;

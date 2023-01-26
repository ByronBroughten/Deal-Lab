import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { useToggleViewNext } from "../../modules/customHooks/useToggleView";
import theme from "../../theme/Theme";
import { EditSectionBtn } from "./EditSectionBtn";
import { FormSection } from "./FormSection";
import { SectionModal } from "./SectionModal";
import { SelectEditor, SelectEditorProps } from "./SelectEditor";

interface Props extends SelectEditorProps {
  isItemized: boolean;
  total: string;
  itemsComponent: React.ReactNode;
}

export function SelectAndItemizeEditor({
  isItemized,
  total,
  itemsComponent,
  onChange,
  rightOfControls,
  ...rest
}: Props) {
  const { itemsIsOpen, closeItems, openItems } = useToggleViewNext(
    "items",
    false
  );
  return (
    <Styled>
      <SelectEditor
        {...{
          onChange: (e) => {
            unstable_batchedUpdates(() => {
              onChange && onChange(e);
              isItemized && openItems();
            });
          },
          ...rest,
          rightOfControls:
            rightOfControls ||
            (isItemized && (
              <>
                <div className="SelectAndItemizeEditor-itemizedTotalDiv">{`Total = ${total}`}</div>
                <EditSectionBtn
                  className="SelectAndItemizeEditor-editBtn"
                  onClick={openItems}
                />
                <SectionModal
                  title="Repairs"
                  closeModal={closeItems}
                  show={itemsIsOpen}
                >
                  {itemsComponent}
                </SectionModal>
              </>
            )),
        }}
      />
    </Styled>
  );
}

const Styled = styled(FormSection)`
  .SelectAndItemizeEditor-itemizedTotalDiv {
    margin-left: ${theme.s3};
    display: flex;
    align-items: center;
  }
  .SelectAndItemizeEditor-editBtn {
    margin-left: ${theme.s2};
  }
`;

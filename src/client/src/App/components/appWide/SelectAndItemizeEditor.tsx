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
  ...rest
}: Props) {
  const { itemsIsOpen, closeItems, openItems } = useToggleViewNext(
    "items",
    false
  );
  return (
    <Styled>
      <div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <SelectEditor
            {...{
              onChange: (e) => {
                unstable_batchedUpdates(() => {
                  onChange && onChange(e);
                  isItemized && openItems();
                });
              },
              ...rest,
            }}
          />
          {isItemized && (
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
          )}
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  .SelectAndItemizeEditor-itemizedTotalDiv {
    padding-bottom: 11px;
    margin-left: ${theme.s3};
  }
  .SelectAndItemizeEditor-editBtn {
    height: 37px;
    margin-left: ${theme.s2};
  }
`;

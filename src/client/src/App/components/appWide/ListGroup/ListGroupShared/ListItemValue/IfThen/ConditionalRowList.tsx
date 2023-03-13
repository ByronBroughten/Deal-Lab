import { rem } from "polished";
import styled from "styled-components";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../../theme/Theme";
import ConditionalRows from "./ConditionalRowList/ConditionalRows";
import LogicRow from "./ConditionalRowList/LogicRow";

type Props = {
  viewIsOpen: boolean;
  toggleView: () => void;
  feId: string;
};
export function ConditionalRowList({ viewIsOpen, toggleView, feId }: Props) {
  const numVarbItem = useGetterSection({
    sectionName: "conditionalRowList",
    feId,
  });

  const conditionalRowIds = numVarbItem.childFeIds("conditionalRow");
  return (
    <Styled className="variable-content">
      <div className="inner-div">
        {!viewIsOpen && (
          <>
            <LogicRow feId={conditionalRowIds[0]} />
            <div className="ellipsis">{"..."}</div>
          </>
        )}
        {viewIsOpen && <ConditionalRows {...{ conditionalRowIds }} />}
        {/* <ToggleViewBtn viewIsOpen={viewIsOpen} onClick={toggleView} /> */}
      </div>
    </Styled>
  );
}

const Styled = styled.tr`
  .trash-btn {
    background: transparent;
    .icon {
      height: ${theme.unlabeledInputHeight};
      width: ${theme.unlabeledInputHeight};
    }
  }

  td.type {
    .MuiSelect-root {
      width: ${rem("50px")};
    }
  }

  .ellipsis {
    display: flex;
    align-items: flex-end;
    position: relative;

    line-height: 20px;

    height: ${theme.unlabeledInputHeight};
    font-size: 1.7rem;
    margin-left: 0.125rem;
  }
`;

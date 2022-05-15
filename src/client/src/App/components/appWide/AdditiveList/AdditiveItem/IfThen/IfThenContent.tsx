import { rem } from "polished";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { FeNameInfo } from "../../../../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import theme from "../../../../../theme/Theme";
import ConditionalRows from "./IfThenContent/ConditionalRows";
import LogicRow from "./IfThenContent/LogicRow";

type Props = {
  viewIsOpen: boolean;
  toggleView: () => void;
  feInfo: FeNameInfo<"userVarbItem">;
};
export default function IfThenContent({
  viewIsOpen,
  toggleView,
  feInfo,
}: Props) {
  const { analyzer } = useAnalyzerContext();
  const conditionalRowIds = analyzer
    .section(feInfo)
    .childFeIds("conditionalRow");
  return (
    <Styled className="variable-content">
      <div className="inner-div">
        {!viewIsOpen && (
          <>
            <LogicRow id={conditionalRowIds[0]} />
            <div className="ellipsis">{"..."}</div>
          </>
        )}
        {viewIsOpen && (
          <ConditionalRows {...{ conditionalRowIds, parentInfo: feInfo }} />
        )}
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

import { rem } from "polished";
import styled from "styled-components";
import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../../../../appWide/RemoveSectionXBtn";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; unitNumber: number };
export function UnitItem({ feId, unitNumber }: Props) {
  const feInfo = { sectionName: "unit", feId } as const;
  const unit = useSetterSection(feInfo);
  return (
    <Styled className="UnitItem-root" key={feId}>
      <div className="UnitItem-viewable">
        <div className="UnitItem-titleRow">
          <div className="UnitItem-titleText">Unit {unitNumber}</div>
          <RemoveSectionXBtn className="UnitItem-xBtn" {...feInfo} />
        </div>
        <NumObjEntityEditor
          className="brs"
          feVarbInfo={unit.varbInfo("numBedrooms")}
        />
        <NumObjEntityEditor
          className="target-rent"
          feVarbInfo={unit.varbInfo("targetRentOngoingEditor")}
        />
      </div>
    </Styled>
  );
}

export const unitItemWidth = "125px";
export const unitItemHeight = "118px";
// it's buggy when you use styled-components css utility
// it works when you just use consts like these

const Styled = styled.div`
  min-width: ${unitItemWidth};
  min-height: ${unitItemHeight};

  .UnitItem-xBtn {
    visibility: hidden;
  }
  :hover {
    .UnitItem-xBtn {
      visibility: visible;
    }
  }

  .UnitItem-viewable {
    color: ${theme.dark};
    border: solid 1px ${theme.primaryBorder};
    border-radius: ${theme.br0};
    padding: ${theme.s25};
    padding-top: ${theme.s15};
  }
  .UnitItem-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .UnitItem-titleText {
    margin-right: ${theme.s2};
    font-size: ${rem("16px")};
  }

  .NumObjEditor-inner {
    margin-top: ${theme.s25};

    .MaterialDraftEditor-wrapper {
      background-color: ${theme.property.light};
      .DraftTextField-root {
        min-width: 110px;
      }
    }
  }
`;

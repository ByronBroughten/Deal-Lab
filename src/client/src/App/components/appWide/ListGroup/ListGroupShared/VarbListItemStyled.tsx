import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme from "../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { UpdateValueNextBtn } from "../../UpdateValueNextBtn";

interface Props extends FeInfoByType<"varbListItem"> {
  firstCells: React.ReactNode;
  nextValueSwitch?: string;
  useXBtn?: boolean;
  className?: string;
}

export function VarbListItemStyled({
  className,
  firstCells,
  nextValueSwitch,
  useXBtn = true,
  ...feInfo
}: Props) {
  return (
    <Styled className={`VarbListItem-root ${className ?? ""}`}>
      {firstCells}
      <td className="VarbListItem-fillerCell"></td>
      {nextValueSwitch && (
        <td className="VarbListItem-buttonCell">
          <UpdateValueNextBtn
            className="VarbListItem-nextBtn"
            {...{
              ...feInfo,
              varbName: "valueSourceSwitch",
              value: nextValueSwitch,
            }}
          />
        </td>
      )}
      {useXBtn && (
        <td className="VarbListItem-buttonCell AdditiveList-buttonCell">
          <RemoveSectionXBtn className="VarbListItem-xBtn" {...feInfo} />
        </td>
      )}
    </Styled>
  );
}

const Styled = styled.tr`
  .DraftTextField-root {
    min-width: 40px;
  }
  .NumObjEditor-calcIconPositioner {
    bottom: 1px;
  }
  .VarbListItem-xBtn,
  .VarbListItem-nextBtn {
    visibility: hidden;
    height: 22px;
    width: 22px;
  }
  :hover {
    .VarbListItem-xBtn,
    .VarbListItem-nextBtn {
      visibility: visible;
    }
  }
  td.VarbListTable-nameCell {
    .DraftTextField-root {
      min-width: 50px;
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

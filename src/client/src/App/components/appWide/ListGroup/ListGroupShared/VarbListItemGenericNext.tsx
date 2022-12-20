import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme from "../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { UpdateValueNextBtn } from "../../UpdateValueNextBtn";

interface Props extends FeInfoByType<"varbListItem"> {
  firstCells: React.ReactNode;
  nextValueSwitch: string;
  className?: string;
}

export function VarbListItemGenericNext({
  firstCells,
  nextValueSwitch,
  sectionName,
  feId,
  ...rest
}: Props) {
  const feInfo = { sectionName, feId };
  return (
    <Styled {...rest}>
      {firstCells}
      <td className="AdditiveItem-buttonCell">
        <UpdateValueNextBtn
          className="AdditiveItem-nextBtn"
          {...{
            ...feInfo,
            varbName: "valueSwitch",
            value: nextValueSwitch,
          }}
        />
      </td>
      <td className="AdditiveItem-buttonCell AdditiveList-buttonCell">
        <RemoveSectionXBtn className="AdditiveItem-xBtn" {...feInfo} />
      </td>
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
  .AdditiveItem-xBtn,
  .AdditiveItem-nextBtn {
    visibility: hidden;
    height: 22px;
    width: 22px;
  }
  :hover {
    .AdditiveItem-xBtn,
    .AdditiveItem-nextBtn {
      visibility: visible;
    }
  }
  td.AdditiveItem-nameCell {
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

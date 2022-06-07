import React from "react";
import styled from "styled-components";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../theme/Theme";
import NextBtn from "../NextBtn";
import XBtn from "../Xbtn";
import IfThen from "./AdditiveItem/IfThen";
import LabeledEquation from "./AdditiveItem/LabeledEquation";
import LabeledSpanOverCost from "./AdditiveItem/LabeledSpanOverCost";
import LoadedVarb from "./AdditiveItem/LoadedVarb";
import { useAdditiveItem } from "./AdditiveItem/useAdditiveItem";

type Props = {
  feId: string;
  sectionName: SectionName<"userListItem">;
};

export default function AdditiveItem(feInfo: Props) {
  const { sectionName, feId } = feInfo;
  const additiveItem = useSetterSection(feInfo);
  const { valueSwitch, toggleValueSwitch, valueVarbName } = useAdditiveItem(
    feInfo,
    sectionName
  );

  return (
    <Styled>
      {valueSwitch === "loadedVarb" && (
        <LoadedVarb feVarbInfo={{ varbName: valueVarbName, ...feInfo }} />
      )}
      {valueSwitch === "labeledEquation" && <LabeledEquation {...{ feInfo }} />}
      {valueSwitch === "labeledSpanOverCost" && (
        <LabeledSpanOverCost {...{ valueVarbName, feInfo }} />
      )}
      {valueSwitch === "ifThen" && <IfThen {...{ feId }} />}
      <td className="AdditiveItem-buttonCell">
        <NextBtn className="AdditiveItem-nextBtn" onClick={toggleValueSwitch} />
      </td>
      <td className="AdditiveItem-buttonCell AdditiveList-buttonCell">
        <XBtn
          className="AdditiveItem-xBtn"
          onClick={() => additiveItem.removeSelf()}
        />
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

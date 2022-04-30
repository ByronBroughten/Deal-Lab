import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { InfoS } from "../../../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../../../sharedWithServer/SectionMetas/SectionName";
import theme from "../../../theme/Theme";
import NextBtn from "../NextBtn";
import XBtn from "../Xbtn";
import IfThen from "./AdditiveItem/IfThen";
import LabeledEquation from "./AdditiveItem/LabeledEquation";
import LabeledSpanOverCost from "./AdditiveItem/LabeledSpanOverCost";
import LoadedVarb from "./AdditiveItem/LoadedVarb";
import { useAdditiveItem } from "./useAdditiveItem";

type Props = {
  id: string;
  sectionName: SectionName<"userListItem">;
};

export default function AdditiveItem({ id, sectionName }: Props) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { handleRemoveSection } = useAnalyzerContext();
  const { valueSwitch, toggleValueSwitch, valueVarbName } = useAdditiveItem(
    feInfo,
    sectionName
  );
  return (
    <Styled>
      {valueSwitch === "loadedVarb" && (
        <LoadedVarb feVarbInfo={InfoS.feVarb(valueVarbName, feInfo)} />
      )}
      {valueSwitch === "labeledEquation" && <LabeledEquation {...{ feInfo }} />}
      {valueSwitch === "labeledSpanOverCost" && (
        <LabeledSpanOverCost {...{ valueVarbName, feInfo }} />
      )}
      {valueSwitch === "ifThen" && InfoS.is.feName(feInfo, "userVarbItem") && (
        <IfThen {...{ feInfo }} />
      )}
      <td className="AdditiveItem-buttonCell">
        <NextBtn className="AdditiveItem-nextBtn" onClick={toggleValueSwitch} />
      </td>
      <td className="AdditiveItem-buttonCell AdditiveList-buttonCell">
        <XBtn
          className="AdditiveItem-xBtn"
          onClick={() => handleRemoveSection(feInfo)}
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

import React from "react";
import styled from "styled-components";
import NextBtn from "../../App/components/appWide/NextBtn";
import XBtn from "../../App/components/appWide/Xbtn";
import { InfoS } from "../../App/sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../App/sharedWithServer/SectionsMeta/SectionName";
import theme from "../../App/theme/Theme";
import IfThen from "./AdditiveList/AdditiveItem/IfThen";
import LabeledEquation from "./AdditiveList/AdditiveItem/LabeledEquation";
import LabeledSpanOverCost from "./AdditiveList/AdditiveItem/LabeledSpanOverCost";
import LoadedVarb from "./AdditiveList/AdditiveItem/LoadedVarb";
import { useAdditiveItem } from "./AdditiveList/useAdditiveItem";
import { useAnalyzerContext } from "./usePropertyAnalyzer";

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

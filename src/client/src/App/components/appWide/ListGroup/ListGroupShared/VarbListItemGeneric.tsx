import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { Arr } from "../../../../sharedWithServer/utils/Arr";
import theme from "../../../../theme/Theme";
import { NextBtn } from "../../NextBtn";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";

interface Props {
  feInfo: FeInfoByType<"varbListItem">;
  switchOptions: Record<string, () => any>;
  className?: string;
}

export function VarbListItemGeneric({ feInfo, switchOptions, ...rest }: Props) {
  const varbItem = useSetterSection(feInfo);
  const switchVarb = varbItem.varb("valueSwitch");
  const switchValue = switchVarb.value("string");
  const switchValues = Object.keys(switchOptions);
  if (!switchValues.includes(switchValue)) {
    throw new Error(
      `switchValue of "${switchValue}" is not in switchValues: ${switchValues}.`
    );
  }
  function toggleValueSwitch(): void {
    const nextSwitchValue = Arr.nextRotatingValue(switchValues, switchValue);
    switchVarb.updateValue(nextSwitchValue);
  }

  return (
    <Styled {...rest}>
      {switchOptions[switchValue]()}
      <td className="AdditiveItem-buttonCell">
        <NextBtn className="AdditiveItem-nextBtn" onClick={toggleValueSwitch} />
      </td>
      <td className="AdditiveItem-buttonCell AdditiveList-buttonCell">
        <RemoveSectionXBtn
          className="AdditiveItem-xBtn"
          {...{
            ...feInfo,
          }}
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

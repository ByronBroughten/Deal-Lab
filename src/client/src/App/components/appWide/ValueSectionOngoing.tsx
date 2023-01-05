import styled from "styled-components";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { ValueSectionGeneric } from "./ValueSectionGeneric";
import { VarbListOngoing } from "./VarbLists/VarbListOngoing";

interface Props {
  className?: string;
  feId: string;
  displayName?: string;
}

export function ValueSectionOngoing({ feId, ...rest }: Props) {
  const section = useSetterSection({
    sectionName: "ongoingValue",
    feId,
  });
  const valueName = section.get.switchVarbName(
    "value",
    "ongoing"
  ) as "valueMonthly";
  return (
    <ValueSectionGeneric
      {...{
        ...rest,
        sectionName: "ongoingValue",
        feId,
        valueName,
        makeItemizedListNode: (props) => <VarbListOngoing {...props} />,
      }}
    />
  );
}

const Styled = styled.div`
  .ValueSectionOngoing-viewable {
    height: ${theme.valueSectionSize};
    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }
  .ValueSectionOngoing-editItemsBtn {
    color: ${theme.primaryNext};
  }

  .ValueSectionOngoing-itemizeControls {
    display: flex;
    align-items: flex-end;
  }
  .ValueSectionOngoing-itemizeGroup {
    margin-top: ${theme.s2};
    margin-left: ${theme.s25};
    .MuiFormControlLabel-root {
      margin-right: ${theme.s2};
      color: ${theme.primaryNext};

      .MuiSwitch-colorPrimary {
        color: ${theme["gray-500"]};
      }

      .MuiSwitch-colorPrimary.Mui-checked {
        color: ${theme.primaryNext};
      }
    }
  }

  .ValueSectionOngoing-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${theme.s3};
    height: 25px;
  }

  .ValueSectionOngoing-valueEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
`;

import { IoMdSettings } from "react-icons/io";
import styled from "styled-components";
import useOnOutsideClickRef from "../../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../../modules/customHooks/useToggleView";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import { listNameToStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";

import ccs from "../../../theme/cssChunks";
import theme, { ThemeSectionName } from "../../../theme/Theme";
import useHowMany from "../customHooks/useHowMany";
import AddItemBtn from "./AdditiveListTable/AddItemBtn";
import AdditiveItem from "./AdditiveItem";
import useAddListItem from "./AdditiveListTable/useAddListItem";
import { valueSwitches } from "./useAdditiveItem";
import { userListItemTypes } from "../../../sharedWithServer/Analyzer/SectionMetas/relSectionTypes/UserListTypes";

const switchValueToDisplay = {
  labeledEquation: "Equation",
  labeledSpanOverCost: "Time over cost",
  ifThen: "If-then",
  loadedVarb: "Saved variable",
} as const;

type Props = { feInfo: FeInfo<"allList">; themeSectionName: ThemeSectionName };
export default function AdditiveListTable({ feInfo, themeSectionName }: Props) {
  const { sectionName } = feInfo;
  const { analyzer, handleDirectUpdate } = useAnalyzerContext();

  const listType = listNameToStoreName(sectionName);
  const contentTitle = listType === "userVarbList" ? "Value" : "Cost";
  const { selectDefaultIsOpen, toggleSelectDefault, closeSelectDefault } =
    useToggleView({
      initValue: false,
      viewWhat: "selectDefault",
    });

  const defaultSwitchVarb = analyzer.feVarb("defaultValueSwitch", feInfo);
  function updateDefaultSwitch(switchValue: string) {
    handleDirectUpdate(defaultSwitchVarb.feVarbInfo, switchValue);
  }

  const itemType = userListItemTypes[listType];
  const switches = valueSwitches[itemType];
  const setDefaultMenuItems = switches.map((switchValue) => ({
    onClick: () => updateDefaultSwitch(switchValue),
    displayValue: switchValueToDisplay[switchValue],
    switchValue,
  }));
  const defaultValueSwitch = defaultSwitchVarb.value("string");

  const itemIds = analyzer.section(feInfo).childFeIds(itemType);
  const addItem = useAddListItem(feInfo, itemType);
  const { isAtLeastOne, areNone } = useHowMany(itemIds);

  const selectDefaultHeaderRef = useOnOutsideClickRef(closeSelectDefault, "th");

  return (
    <Styled className="AdditiveListTable-root" sectionName={themeSectionName}>
      {areNone && <AddItemBtn onClick={addItem} className="noTable" />}
      {isAtLeastOne && (
        <table className="AdditiveListTable-table">
          <thead>
            <tr>
              <th className="AdditiveListTable-nameHeader">Name</th>
              <th className="AdditiveListTable-contentHeader">
                {contentTitle}
              </th>
              <th colSpan={2} className="AdditiveListTable-buttonHeader">
                <AddItemBtn className="yesTable" onClick={addItem} />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...itemIds].reverse().map((itemId) => {
              return (
                <AdditiveItem
                  {...{
                    key: itemId,
                    id: itemId,
                    sectionName: itemType,
                  }}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </Styled>
  );
}

const Styled = styled.div<{
  sectionName: ThemeSectionName;
}>`
  .AdditiveListTable-addItemBtn {
    font-weight: 900;
    height: ${theme.unlabeledInputHeight};
    width: 50px;
  }
  .AdditiveListTable-addItemBtn.noTable {
    width: 100%;
    margin-top: ${theme.s2};
  }

  .AdditiveListTable-table {
    ${({ sectionName }) => ccs.listTable.main(sectionName)}
  }
  th.AdditiveListTable-nameHeader {
    text-align: left;
  }
  th.AdditiveListTable-contentHeader,
  th.AdditiveListTable-buttonHeader {
    text-align: center;
  }

  th.AdditiveListTable-nameHeader,
  td.AdditiveItem-nameCell {
    background: ${theme["gray-200"]};
  }

  th.AdditiveListTable-contentHeader,
  td.AdditiveItem-contentCell {
    border-left: 1px solid ${({ sectionName }) => theme[sectionName].border};
  }

  .AdditiveItem-contentCellDiv {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

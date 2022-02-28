import { IoMdSettings } from "react-icons/io";
import styled from "styled-components";
import useOnOutsideClickRef from "../../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../../modules/customHooks/useToggleView";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import { listNameToStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseNameArrs";
import { userListItemTypes } from "../../../sharedWithServer/Analyzer/SectionMetas/relSectionTypes";
import ccs from "../../../theme/cssChunks";
import theme, { ThemeSectionName } from "../../../theme/Theme";
import BtnTooltip from "../BtnTooltip";
import useHowMany from "../customHooks/useHowMany";
import PlusBtn from "../PlusBtn";
import SimpleMuiMenu from "../SimpleMuiMenu";
import AdditiveItem from "./AdditiveItem";
import useAddListItem from "./AdditiveListTable/useAddListItem";
import { valueSwitches } from "./useAdditiveItem";

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
      {areNone && <PlusBtn onClick={addItem}>Add item +</PlusBtn>}
      {isAtLeastOne && (
        <table className="AdditiveListTable-table">
          <thead>
            <tr>
              <th className="AdditiveListTable-nameHeader">Name</th>
              <th className="AdditiveListTable-contentHeader">
                {contentTitle}
              </th>
              <th
                className="AdditiveListTable-buttonHeader"
                ref={selectDefaultHeaderRef}
              >
                <BtnTooltip title="Set default row type">
                  <PlusBtn
                    onClick={toggleSelectDefault}
                    smallSquare={true}
                    isOpen={selectDefaultIsOpen}
                  >
                    <IoMdSettings size={20} />
                  </PlusBtn>
                </BtnTooltip>
                {selectDefaultIsOpen && (
                  <SimpleMuiMenu
                    {...{
                      closeMenu: closeSelectDefault,
                      items: setDefaultMenuItems,
                      selectedValue: defaultValueSwitch,
                      className: "AdditiveList-setDefaultMenu",
                    }}
                  />
                )}
              </th>
              <th className="AdditiveListTable-buttonHeader">
                <PlusBtn onClick={addItem} />
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

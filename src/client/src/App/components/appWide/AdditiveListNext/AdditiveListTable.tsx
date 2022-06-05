import styled from "styled-components";
import { listNameToStoreName } from "../../../sharedWithServer/SectionsMeta/baseSectionTypes";
import { FeInfoByType } from "../../../sharedWithServer/SectionsMeta/Info";
import { userListItemTypes } from "../../../sharedWithServer/SectionsMeta/relSectionTypes/UserListTypes";
import { useSetterSection } from "../../../sharedWithServer/StateHooks/useSetterSection";
import ccs from "../../../theme/cssChunks";
import theme, { ThemeSectionName } from "../../../theme/Theme";
import useHowMany from "../customHooks/useHowMany";
import AdditiveItem from "./AdditiveItem";
import AddItemBtn from "./AdditiveListTable/AddItemBtn";

// const switchValueToDisplay = {
//   labeledEquation: "Equation",
//   labeledSpanOverCost: "Time over cost",
//   ifThen: "If-then",
//   loadedVarb: "Saved variable",
// } as const;

type Props = {
  feInfo: FeInfoByType<"allList">;
  themeSectionName: ThemeSectionName;
};

export default function AdditiveListTable({ feInfo, themeSectionName }: Props) {
  const { sectionName } = feInfo;
  const table = useSetterSection(feInfo);
  const listType = listNameToStoreName(sectionName);
  const itemType = userListItemTypes[listType];
  const itemIds = table.childFeIds(itemType);
  const { isAtLeastOne, areNone } = useHowMany(itemIds);
  const contentTitle = listType === "userVarbList" ? "Value" : "Cost";

  const addItem = () => {
    const defaultValueSwitch = table.get.value("defaultValueSwitch", "string");
    table.addChild(itemType, {
      dbVarbs: { valueSwitch: defaultValueSwitch },
    });
  };

  // const switches = valueSwitches[itemType];
  // const { selectDefaultIsOpen, toggleSelectDefault, closeSelectDefault } =
  //   useToggleView({
  //     initValue: false,
  //     viewWhat: "selectDefault",
  //   });
  // const defaultSwitchVarb = analyzer.feVarb("defaultValueSwitch", feInfo);
  // function updateDefaultSwitch(switchValue: string) {
  //   handleDirectUpdate(aefaultSwitchVarb.feVarbInfo, switchValue);
  // }
  // const selectDefaultHeaderRef = useOnOutsideClickRef(closeSelectDefault, "th");
  // const setDefaultMenuItems = switches.map((switchValue) => ({
  //   onClick: () => updateDefaultSwitch(switchValue),
  //   displayValue: switchValueToDisplay[switchValue],
  //   switchValue,
  // }));
  // const defaultValueSwitch = defaultSwitchVarb.value("string");

  return (
    <Styled className="AdditiveListTable-root" sectionName={themeSectionName}>
      {areNone && (
        // <BtnTooltip
        //   title="Add list item"
        //   className="AdditiveListTable-addItemBtn noTable"
        // >
        <AddItemBtn onClick={addItem} className="noTable" />
        // </BtnTooltip>
      )}
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
                    feId: itemId,
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
    margin-top: ${theme.s1};
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

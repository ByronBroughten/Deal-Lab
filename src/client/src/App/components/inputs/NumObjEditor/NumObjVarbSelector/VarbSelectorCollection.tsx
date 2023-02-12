import styled from "styled-components";
import { SetEditorState } from "../../../../modules/draftjs/draftUtils";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { ValueInEntityInfo } from "../../../../sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { insertVarbEntity } from "./insertVarbEntity";
import { VarbSelectorRow } from "./VarbSelectorRow";

interface Props {
  collectionName?: string;
  focalInfo: FeSectionInfo;
  rowInfos: ValueInEntityInfo[];
  setEditorState: SetEditorState;
}
export function VarbSelectorCollection({
  collectionName,
  focalInfo,
  rowInfos,
  setEditorState,
}: Props) {
  const section = useGetterSection(focalInfo);
  return (
    <Styled className="VarbSelectorRows-root">
      {collectionName && (
        <div className="VarbSelectorRows-collectionNameContainer">
          <span className="VarbSelectorRows-collectionName">
            {collectionName}
          </span>
        </div>
      )}
      {rowInfos.map((varbInfo) => {
        const { displayNameFull } = section.varbByFocalMixed(varbInfo);
        return (
          <VarbSelectorRow
            {...{
              displayName: displayNameFull,
              onClick: () =>
                insertVarbEntity({
                  setEditorState,
                  displayName: displayNameFull,
                  varbInfo,
                }),
            }}
          />
        );
      })}
    </Styled>
  );
}

const Styled = styled.div`
  .VarbSelectorRows-collectionNameContainer {
    height: 30px;
    display: flex;
    align-items: center;
    padding-left: ${theme.s3};
    background-color: ${theme["gray-200"]};
  }
`;

import styled from "styled-components";
import { ValueInEntityInfo } from "../../../../sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";
import { useGetterSectionOnlyOne } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { VarbSelectorRow } from "./VarbSelectorRow";

export type OnVarbSelect = (varbInfo: ValueInEntityInfo) => void;

interface Props {
  collectionName?: string;
  rowInfos: ValueInEntityInfo[];
  onVarbSelect: OnVarbSelect;
}
export function VarbSelectorCollection({
  collectionName,
  rowInfos,
  onVarbSelect,
}: Props) {
  const latent = useGetterSectionOnlyOne("latentSections");
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
        const { displayNameFull, varbId } = latent.varbByFocalMixed(varbInfo);
        return (
          <VarbSelectorRow
            {...{
              key: varbId,
              displayName: displayNameFull,
              onClick: () => onVarbSelect(varbInfo),
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

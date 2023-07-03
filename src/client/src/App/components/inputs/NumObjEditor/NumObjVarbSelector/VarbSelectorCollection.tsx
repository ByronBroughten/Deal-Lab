import styled from "styled-components";
import { useGetterMain } from "../../../../sharedWithServer/stateClassHooks/useMain";
import { ValueInEntityInfo } from "../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
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
  const main = useGetterMain();
  const latent = main.onlyChild("latentDealSystem");
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
        const { variableLabel, varbId } = latent.varbByFocalMixed(varbInfo);
        return (
          <VarbSelectorRow
            {...{
              key: varbId,
              displayName: variableLabel,
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

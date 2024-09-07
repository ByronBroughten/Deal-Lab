import styled from "styled-components";
import { ValueInEntityInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { useGetterMain } from "../../../../../stateHooks/useMain";
import theme from "../../../../../theme/Theme";
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
        const { variableLabel, varbId, varbLabels } =
          latent.varbByFocalMixed(varbInfo);
        const { info, title } = varbLabels;

        return (
          <VarbSelectorRow
            {...{
              key: varbId,
              displayName: variableLabel,
              ...(info && title && { infoProps: { title, info } }),
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

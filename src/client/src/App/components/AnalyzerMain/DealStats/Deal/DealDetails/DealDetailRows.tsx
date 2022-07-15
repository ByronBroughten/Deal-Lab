import styled from "styled-components";
import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFound,
} from "./DealDetailRow";

export function DealDetailRowsNext({
  varbInfo,
  level,
}: {
  varbInfo: FeVarbInfo;
  level: number;
}) {
  level = level + 1;
  const varb = useSetterVarb(varbInfo);
  return (
    <Styled className="DealDetailRows-root">
      {varb.inVarbInfos.map((inInfo) => {
        if (varb.sections.hasSectionMixed(inInfo)) {
          const inVarb = varb.sections.varbByMixed(inInfo);
          return (
            <DealDetailRowVarbFound
              {...{
                varbInfo: inVarb.feVarbInfo,
                level,
                key: inVarb.varbId,
              }}
            />
          );
        } else {
          if (!("entityId" in inInfo)) {
            throw new Error(
              `Only entities should be missing here, not relative varb infos.`
            );
          }
          return (
            <DealDetailRowVarbNotFound
              {...{
                varbInfo,
                level,
                entityId: inInfo.entityId,
                key: inInfo.entityId,
              }}
            />
          );
        }
      })}
    </Styled>
  );
}

const Styled = styled.div``;

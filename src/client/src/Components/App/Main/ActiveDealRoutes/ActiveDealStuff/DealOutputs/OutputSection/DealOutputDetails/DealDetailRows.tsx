import { isEqual } from "lodash";
import styled from "styled-components";
import { useGetterVarb } from "../../../../../../../../modules/stateHooks/useGetterVarb";
import { GetterVarb } from "../../../../../../../../sharedWithServer/StateGetters/GetterVarb";
import { FeVarbInfo } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFound,
} from "./DealDetailRow";

function skipToNextVarbIfDuplicate(varb: GetterVarb): GetterVarb {
  let count = 0;
  let isGoing = true;
  while (isGoing) {
    isGoing = false;
    const { activeMixedInfos } = varb.inEntity;
    for (const inInfo of activeMixedInfos) {
      const { section } = varb;
      if (section.hasVarbByFocalMixed(inInfo)) {
        const inVarb = section.varbByFocalMixed(inInfo);
        if (
          inVarb.valueName === "numObj" &&
          isEqual(
            varb.value("numObj").solvableText,
            inVarb.value("numObj").solvableText
          )
        ) {
          varb = inVarb;
          isGoing = true;
        }
      }
    }

    count++;
    if (count === 100) {
      throw new Error(`While loop exceeded limit with ${varb.varbId}`);
    }
  }
  return varb;
}
export function DealDetailRowsNext({
  varbInfo,
  level,
}: {
  varbInfo: FeVarbInfo;
  level: number;
}) {
  level = level + 1;
  const varb = useGetterVarb(varbInfo);
  const { section, sections } = varb;
  return (
    <Styled className="DealDetailRows-root">
      {varb.inEntity.activeMixedInfos.map((inInfo) => {
        if (section.hasVarbByFocalMixed(inInfo)) {
          const { feVarbInfo } = section.varbByFocalMixed(inInfo);
          let inVarb = sections.varb(feVarbInfo);
          if (inVarb.meta.valueName === "numObj") {
            inVarb = skipToNextVarbIfDuplicate(inVarb);
            return (
              <DealDetailRowVarbFound
                {...{
                  varbInfo: inVarb.feVarbInfo,
                  level,
                  key: inVarb.varbId,
                }}
              />
            );
          } else return null;
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

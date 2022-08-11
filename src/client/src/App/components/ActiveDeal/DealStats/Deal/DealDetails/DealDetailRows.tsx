import { isEqual } from "lodash";
import styled from "styled-components";
import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import { SetterVarb } from "../../../../../sharedWithServer/StateSetters/SetterVarb";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFound,
} from "./DealDetailRow";

function skipVarbIfDuplicate(varb: SetterVarb): SetterVarb {
  if (varb.inVarbInfos.length === 1) {
    const inInfo = varb.inVarbInfos[0];
    const { setterSections, sections } = varb;
    if (sections.hasSectionMixed(inInfo)) {
      const { feVarbInfo } = sections.varbByMixed(inInfo);
      const inVarb = setterSections.varb(feVarbInfo);
      if (isEqual(varb.value("any"), inVarb.value("any"))) {
        return inVarb;
      }
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
  const varb = useSetterVarb(varbInfo);
  const { setterSections, sections } = varb;
  return (
    <Styled className="DealDetailRows-root">
      {varb.inVarbInfos.map((inInfo) => {
        if (sections.hasSectionMixed(inInfo)) {
          const { feVarbInfo } = sections.varbByMixed(inInfo);
          let inVarb = setterSections.varb(feVarbInfo);
          if (inVarb.meta.valueName === "numObj") {
            inVarb = skipVarbIfDuplicate(inVarb);
            return (
              <DealDetailRowVarbFound
                {...{
                  varbInfo: inVarb.get.feVarbInfo,
                  level,
                  key: inVarb.get.varbId,
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

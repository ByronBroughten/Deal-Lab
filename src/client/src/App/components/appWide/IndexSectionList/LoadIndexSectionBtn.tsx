import React from "react";
import styled from "styled-components";
import PlainBtn from "../../general/PlainBtn";
import theme from "../../../theme/Theme";
import { useStores } from "../../../modules/customHooks/useStore";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import { SectionNam } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";

type Props = {
  feInfo: FeInfo<"hasIndexStore">;
  dbId: string;
  title: string;
};

function useLoadIndexSection(feInfo: FeInfo<"hasIndexStore">, dbId: string) {
  const { handleSet } = useAnalyzerContext();
  const store = useStores();
  const { sectionName } = feInfo;
  if (SectionNam.is(sectionName, "hasRowIndexStore"))
    return async () =>
      await store.loadSectionFromDbIndex({ ...feInfo, sectionName }, dbId);
  else
    return () =>
      handleSet("loadSectionFromFeIndex", { ...feInfo, sectionName }, dbId);
}

// Fix load section visual (add tooltip, maybe); fix list menu visual;
// make load section menu close on outside click
export default React.memo(function LoadIndexSectionBtn({
  feInfo,
  dbId,
  title,
}: Props) {
  const load = useLoadIndexSection(feInfo, dbId);

  return (
    <Styled className="LoadIndexSectionBtn-root" onClick={load}>
      {title}
    </Styled>
  );
});

const Styled = styled(PlainBtn)`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  white-space: nowrap;
  :hover {
    background-color: ${theme["gray-400"]};
  }
`;

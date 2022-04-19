import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { useSectionQueryActions } from "../../../modules/useQueryActions/useSectionQueryActions";
import { FeInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import { sectionNameS } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import theme from "../../../theme/Theme";
import PlainBtn from "../../general/PlainBtn";

type Props = {
  feInfo: FeInfo<"hasIndexStore">;
  dbId: string;
  title: string;
};

function useLoadIndexSection(feInfo: FeInfo<"hasIndexStore">, dbId: string) {
  const { handleSet } = useAnalyzerContext();
  const store = useSectionQueryActions();
  const { sectionName } = feInfo;
  if (sectionNameS.is(sectionName, "hasRowIndexStore"))
    return async () =>
      await store.loadSectionFromDbIndex({ ...feInfo, sectionName }, dbId);
  else
    return () =>
      handleSet("loadSectionFromFeIndex", { ...feInfo, sectionName }, dbId);
}

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

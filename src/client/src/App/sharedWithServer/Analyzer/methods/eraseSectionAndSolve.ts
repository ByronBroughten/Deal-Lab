import Analyzer from "../../Analyzer";
import {
  FeVarbInfo,
  SpecificSectionInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { rowIndexToTableName } from "../SectionMetas/relSectionTypes";
import { Inf, FeInfo } from "../SectionMetas/Info";
import Arr from "../../utils/Arr";
import { SectionName } from "../SectionMetas/SectionName";

export function eraseSectionAndSolve(
  this: Analyzer,
  info: SpecificSectionInfo
): Analyzer {
  const { feInfo } = this.section(info);
  const [next, infosAffectedByErase] = this.eraseSectionAndChildren(feInfo);
  return next.solveVarbs(infosAffectedByErase);
}
export function deleteIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasIndexStore">,
  dbId: string
): Analyzer {
  const { indexStoreName } = this.sectionMeta(sectionName);
  const indexInfo = Inf.db(indexStoreName, dbId);
  return this.eraseSectionAndSolve(indexInfo);
}
export function deleteRowIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasRowIndexStore">,
  dbId: string
): Analyzer {
  let next = this;

  const { indexStoreName } = this.sectionMeta(sectionName);
  const tableName = rowIndexToTableName[indexStoreName];
  const rowIdsVarb = this.section(tableName).varb("rowIds");

  let rowIds = rowIdsVarb.value("stringArray");
  rowIds = Arr.rmFirstValueClone(rowIds, dbId);
  next = next.updateValueDirectly(rowIdsVarb.feVarbInfo, rowIds);
  return next.deleteIndexAndSolve(sectionName, dbId);
}

export function eraseSectionsAndSolve(
  this: Analyzer,
  feInfos: FeInfo[]
): Analyzer {
  let infosAffectedByErase: FeVarbInfo[] = [];
  const [next, allAffectedInfos] = feInfos.reduce(
    ([next, allAffectedInfos], feInfo) => {
      [next, infosAffectedByErase] = next.eraseSectionAndChildren(feInfo);
      return [next, allAffectedInfos.concat(infosAffectedByErase)] as const;
    },
    [this, []] as readonly [Analyzer, FeVarbInfo[]]
  );

  return next.solveVarbs(allAffectedInfos);
}

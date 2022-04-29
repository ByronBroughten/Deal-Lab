import Analyzer from "../../sharedWithServer/Analyzer";
import { DbEnt } from "../../sharedWithServer/Analyzer/DbEntry";
import { FeInfo } from "../../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/SectionMetas/SectionName";
import { crud } from "../crud";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { sectionQueries } from "./useSectionQueryActions/sectionQueries";

export function useSectionQueryActions() {
  const { analyzer, setAnalyzerOrdered, handleSet, setAnalyzer } =
    useAnalyzerContext();

  function setAnalyzerToDefault() {
    setAnalyzerOrdered(analyzer);
  }

  async function queryAndRevertSetIfFail<
    Action extends keyof typeof sectionQueries,
    Args extends Parameters<typeof sectionQueries[Action]>
  >(action: Action, ...args: Args) {
    const fn: (
      this: typeof sectionQueries,
      ...args: any
    ) => Promise<{ data: any } | undefined> = sectionQueries[action];
    const didSucceed = await fn.apply(sectionQueries, args);
    if (!didSucceed) setAnalyzerToDefault();
  }

  return {
    async deleteRowIndexEntry(
      sectionName: SectionName<"hasRowIndexStore">,
      dbId: string
    ) {
      handleSet("eraseRowIndexAndSolve", sectionName, dbId);
      queryAndRevertSetIfFail("deleteIndexEntry", sectionName, dbId);
    },
    async saveNewRowIndexSection(feInfo: FeInfo<"hasRowIndexStore">) {
      const next = analyzer.saveNewSectionToRowIndexStore(feInfo);
      setAnalyzer(() => next);
      queryAndRevertSetIfFail("saveNewIndexSection", feInfo, next);
    },
    async updateRowIndexSection(feInfo: FeInfo<"hasRowIndexStore">) {
      const next = analyzer.updateRowIndexStoreSection(feInfo);
      setAnalyzer(() => next);
      queryAndRevertSetIfFail("updateIndexSection", feInfo, analyzer);
    },
    async postTableColumns(
      tableName: SectionName<"table">,
      next: Analyzer = analyzer
    ) {
      const { rowSourceName } = analyzer.sectionMeta(tableName).core;
      const tableEntryArr = next.dbEntryArr(tableName);
      const res = await crud.postTableColumns(tableEntryArr, tableName);
      if (res) {
        next = next.loadSectionArrAndSolve(rowSourceName, res.data);
        setAnalyzerOrdered(next);
      }
    },
    // ideally, adding a new table column won't be so hard
    // and then I can use that to build the table up
    // and then I can simplify all the other queries to pretty
    // much just use typical section add and delete stuff.
    // Yeah, I like this.
    // Ok, I'm going to run with that target
    // Make the sectionQueryActor, and imbed that inside
    // the table control.

    async saveNewFullIndexSection(feInfo: FeInfo<"hasAnyIndexStore">) {
      // handleSet won't work here because in next, the section to post has
      // altered dbIds
      const next = analyzer.saveNewSectionToFullIndexStore(feInfo);
      setAnalyzer(() => next);
      queryAndRevertSetIfFail("saveNewIndexSection", feInfo, next);
    },
    async updateFullIndexSection(feInfo: FeInfo<"hasAnyIndexStore">) {
      const next = analyzer.updateFullIndexStoreSection(feInfo);
      setAnalyzer(() => next);
      queryAndRevertSetIfFail("updateIndexSection", feInfo, next);
    },
    // delete
    async deleteIndexEntry(
      sectionName: SectionName<"hasAnyIndexStore">,
      dbId: string
    ) {
      handleSet("eraseIndexAndSolve", sectionName, dbId);
      queryAndRevertSetIfFail("deleteIndexEntry", sectionName, dbId);
    },

    async postEntryArr(
      sectionName: SectionName<"savable">,
      next: Analyzer = analyzer
    ) {
      // In this case, you already have a full entry arr and are just posting to the server
      const reqObj = next.req.postSectionArr(sectionName);
      await crud.sectionArr.post.send(reqObj);
    },
    async postDefault(feInfo: FeInfo<"hasDefaultStore">) {
      const { sectionName } = feInfo;
      const next = analyzer.setAsDefaultSectionArr(feInfo);
      setAnalyzerOrdered(next);

      if (auth.isLoggedIn) {
        const { defaultStoreName } = next.sectionMeta(sectionName).core;
        const reqObj = next.req.postSectionArr(defaultStoreName);
        await crud.sectionArr.post.send(reqObj);
      }
    },

    // load
    loadSectionFromFeDefault(
      params: Parameters<typeof analyzer.loadSectionFromFeDefault>
    ): void {
      handleSet("loadSectionFromFeDefault", ...params);
    },
    loadSectionFromFeIndex(
      params: Parameters<typeof analyzer.loadSectionFromFeIndex>
    ): void {
      handleSet("loadSectionFromFeIndex", ...params);
    },
    async loadSectionFromDbIndex(
      feInfo: FeInfo<"hasIndexStore">,
      dbId: string
    ): Promise<void> {
      const { indexStoreName } = analyzer.section(feInfo);
      const result = await crud.section.get.send(
        analyzer.req.getSection(indexStoreName, dbId)
      );
      if (result) {
        const dbEntry = DbEnt.changeMainName(
          result.data,
          indexStoreName,
          feInfo.sectionName
        );
        handleSet("resetSectionAndSolve", feInfo, { dbEntry });
      }
    },
  };
}
// There will only be indexEntry

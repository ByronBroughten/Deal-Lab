import Analyzer from "../../sharedWithServer/Analyzer";
import { DbEnt } from "../../sharedWithServer/Analyzer/DbEntry";
import { sectionMetas } from "../../sharedWithServer/Analyzer/SectionMetas";
import { FeInfo } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { crud } from "../crud";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";

const dbStore = {
  async deleteIndexEntry(
    sectionName: SectionName<"hasIndexStore">,
    dbId: string
  ) {
    const dbStoreName = sectionMetas.section(sectionName).get("indexStoreName");
    return await crud.section.delete.send({ params: { dbStoreName, dbId } });
  },
  async putIndexEntry(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    return await crud.section.put.send(next.req.putSection(feInfo));
  },
  async postIndexEntry(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    return await crud.section.post.send(next.req.postIndexEntry(feInfo));
  },
} as const;

export function useSectionQueryActions() {
  const { analyzer, setAnalyzerOrdered, handleSet } = useAnalyzerContext();

  function setAnalyzerToDefault() {
    setAnalyzerOrdered(analyzer);
  }

  async function doOrBackToDefault<
    Action extends keyof typeof dbStore,
    Args extends Parameters<typeof dbStore[Action]>
  >(action: Action, ...args: Args) {
    const fn: (
      this: typeof dbStore,
      ...args: any
    ) => Promise<{ data: any } | undefined> = dbStore[action];
    const didSucceed = await fn.apply(dbStore, args);
    if (!didSucceed) setAnalyzerToDefault();
  }

  return {
    // post
    async postIndexEntry(feInfo: FeInfo<"hasFullIndexStore">) {
      handleSet("pushToIndexStore", feInfo);
      doOrBackToDefault("postIndexEntry", feInfo, analyzer);
    },
    async postRowIndexEntry(feInfo: FeInfo<"hasRowIndexStore">) {
      handleSet("pushToRowIndexStore", feInfo);
      doOrBackToDefault("postIndexEntry", feInfo, analyzer);
    },
    async postEntryArr(
      sectionName: SectionName<"savable">,
      next: Analyzer = analyzer
    ) {
      // In this case, you already have a full entry arr and are just posting to the server
      const reqObj = next.req.postSectionArr(sectionName);
      await crud.sectionArr.post.send(reqObj);
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

    // put
    async putRowIndexEntry(feInfo: FeInfo<"hasRowIndexStore">) {
      handleSet("updateRowIndexStoreAndSolve", feInfo);
      doOrBackToDefault("putIndexEntry", feInfo, analyzer);
    },
    async putIndexEntry(feInfo: FeInfo<"hasFullIndexStore">) {
      handleSet("updateIndexStoreEntry", feInfo);
      doOrBackToDefault("putIndexEntry", feInfo, analyzer);
    },
    // I don't really need useStore for fe store stuff, right?
    // I could have, analyzer.sectionStore.get(), or something

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

    // delete
    async deleteIndexEntry(
      sectionName: SectionName<"hasFullIndexStore">,
      dbId: string
    ) {
      handleSet("eraseIndexAndSolve", sectionName, dbId);
      doOrBackToDefault("deleteIndexEntry", sectionName, dbId);
    },
    async deleteRowIndexEntry(
      sectionName: SectionName<"hasRowIndexStore">,
      dbId: string
    ) {
      handleSet("eraseRowIndexAndSolve", sectionName, dbId);
      doOrBackToDefault("deleteIndexEntry", sectionName, dbId);
    },

    // in addition to eraseIndexAndSolve, I need eraseRowIndexAndSolve
    // It's the same, except I need to remove the rowIndex from the table's dbIds
  };
}
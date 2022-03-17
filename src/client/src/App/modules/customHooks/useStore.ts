import Analyzer from "../../sharedWithServer/Analyzer";
import { sectionMetas } from "../../sharedWithServer/Analyzer/SectionMetas";
import { DbEnt } from "../../sharedWithServer/Analyzer/DbEntry";
import { FeInfo } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { crud } from "../crud";

const dbStore = {
  async deleteIndexEntry(
    sectionName: SectionName<"hasIndexStore">,
    dbId: string
  ) {
    const dbStoreName = sectionMetas.get(sectionName).indexStoreName;
    return await crud.deleteSection({ params: { dbStoreName, dbId } });
  },
  async putIndexEntry(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    const { indexStoreName } = next.sectionMeta(feInfo.sectionName);
    const dbEntry = next.dbIndexEntry(feInfo);
    return await crud.putEntry(dbEntry, indexStoreName);
  },
  async postIndexEntry(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    return await crud.postSection.send(next.req.postIndexEntry(feInfo));
  },
} as const;

export function useStores() {
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
      await crud.postSectionArr.send(reqObj);
    },
    async postTableColumns(
      tableName: SectionName<"table">,
      next: Analyzer = analyzer
    ) {
      const { rowSourceName } = analyzer.sectionMeta(tableName);
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
        const { defaultStoreName } = next.sectionMeta(sectionName);
        const reqObj = next.req.postSectionArr(defaultStoreName);
        await crud.postSectionArr.send(reqObj);
      }
    },

    // put
    async putRowIndexEntry(feInfo: FeInfo<"hasRowIndexStore">) {
      handleSet("updateRowIndexStore", feInfo);
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
      const result = await crud.getSection(
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

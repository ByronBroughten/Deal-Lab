import Analyzer from "../../sharedWithServer/Analyzer";
import { sectionMetas } from "../../sharedWithServer/Analyzer/SectionMetas";
import { DbEnt, DbEntry } from "../../sharedWithServer/Analyzer/DbEntry";
import { FeInfo } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { auth } from "../services/authService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { crud } from "./useStore/useCrud";

const dbStore = {
  async postEntryArr(
    sectionName: SectionName<"savable">,
    dbEntryArr: DbEntry[]
  ) {
    return await crud.postEntryArr(dbEntryArr, sectionName);
  },
  async postTableColumns(
    sectionName: SectionName<"table">,
    dbEntryArr: DbEntry[]
  ) {
    return await crud.postTableColumns(dbEntryArr, sectionName);
  },
  async deleteIndexEntry(
    sectionName: SectionName<"hasIndexStore">,
    dbId: string
  ) {
    const storeName = sectionMetas.get(sectionName).indexStoreName;
    return await crud.deleteEntry(dbId, storeName);
  },
  async putIndexEntry(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    const { indexStoreName } = next.sectionMeta(feInfo.sectionName);
    const dbEntry = next.toDbIndexEntry(feInfo);
    return await crud.putEntry(dbEntry, indexStoreName);
  },
  async postIndexEntry(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    const { indexStoreName } = next.sectionMeta(feInfo.sectionName);
    const dbEntry = next.toDbIndexEntry(feInfo);
    return await crud.postEntry(dbEntry, indexStoreName);
  },
} as const;

export function useStores() {
  const { analyzer, setAnalyzerOrdered, handle } = useAnalyzerContext();

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
      handle("pushToIndexStore", feInfo);
      doOrBackToDefault("postIndexEntry", feInfo, analyzer);
    },
    async postRowIndexEntry(feInfo: FeInfo<"hasRowIndexStore">) {
      handle("pushToRowIndexStore", feInfo);
      doOrBackToDefault("postIndexEntry", feInfo, analyzer);
    },
    async postEntryArr(
      sectionName: SectionName<"savable">,
      next: Analyzer = analyzer
    ) {
      // In this case, you already have a full entry arr and are just posting to the server
      const dbEntryArr = next.toDbEntryArr(sectionName);
      await crud.postEntryArr(dbEntryArr, sectionName);
    },
    async postTableColumns(
      tableName: SectionName<"table">,
      next: Analyzer = analyzer
    ) {
      const { rowSourceName } = analyzer.sectionMeta(tableName);
      const tableEntryArr = next.toDbEntryArr(tableName);
      const res = await dbStore.postTableColumns(tableName, tableEntryArr);
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
        const nextDbEntryArr = next.toDbEntryArr(defaultStoreName);
        await dbStore.postEntryArr(defaultStoreName, nextDbEntryArr);
      }
    },

    // put
    async putRowIndexEntry(feInfo: FeInfo<"hasRowIndexStore">) {
      handle("updateRowIndexStore", feInfo);
      doOrBackToDefault("putIndexEntry", feInfo, analyzer);
    },
    async putIndexEntry(feInfo: FeInfo<"hasFullIndexStore">) {
      handle("updateIndexStoreEntry", feInfo);
      doOrBackToDefault("putIndexEntry", feInfo, analyzer);
    },

    // load
    loadSectionFromFeDefault(
      params: Parameters<typeof analyzer.loadSectionFromFeDefault>
    ): void {
      handle("loadSectionFromFeDefault", ...params);
    },
    loadSectionFromFeIndex(
      params: Parameters<typeof analyzer.loadSectionFromFeIndex>
    ): void {
      handle("loadSectionFromFeIndex", ...params);
    },
    async loadSectionFromDbIndex(
      feInfo: FeInfo<"hasIndexStore">,
      dbId: string
    ): Promise<void> {
      const { indexStoreName } = analyzer.section(feInfo);
      const result = await crud.getEntry(indexStoreName, dbId);
      if (result) {
        const dbEntry = DbEnt.changeMainName(
          result.data,
          indexStoreName,
          feInfo.sectionName
        );
        handle("resetSectionAndSolve", feInfo, { dbEntry });
      }
    },

    // delete
    async deleteIndexEntry(
      sectionName: SectionName<"hasFullIndexStore">,
      dbId: string
    ) {
      handle("deleteIndexAndSolve", sectionName, dbId);
      doOrBackToDefault("deleteIndexEntry", sectionName, dbId);
    },
    async deleteRowIndexEntry(
      sectionName: SectionName<"hasRowIndexStore">,
      dbId: string
    ) {
      handle("deleteRowIndexAndSolve", sectionName, dbId);
      doOrBackToDefault("deleteIndexEntry", sectionName, dbId);
    },

    // in addition to deleteIndexAndSolve, I need deleteRowIndexAndSolve
    // It's the same, except I need to remove the rowIndex from the table's dbIds
  };
}

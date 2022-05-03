import { SectionPack } from "../client/src/App/sharedWithServer/Analyzer/SectionPack";
import {
  SectionPackDbRaw,
  SectionPackRaw,
} from "../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { DbVarbs } from "../client/src/App/sharedWithServer/Analyzer/SectionPackRaw/RawSection";
import { LoginUserNext } from "../client/src/App/sharedWithServer/apiQueriesShared/login";
import { sectionMetas } from "../client/src/App/sharedWithServer/SectionMetas";
import {
  savableNameS,
  SavableSectionName,
} from "../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import {
  SectionName,
  sectionNameS,
} from "../client/src/App/sharedWithServer/SectionMetas/SectionName";
import Arr from "../client/src/App/sharedWithServer/utils/Arr";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { SectionPackDb } from "./SectionPackDb";

export class ServerUser {
  constructor(readonly core: UserDbCore) {}
  makeRawFeLoginUser(): LoginUserNext {
    return sectionNameS.arrs.loadOnLogin.reduce((loginUser, sectionName) => {
      (loginUser[sectionName] as SectionPackRaw<typeof sectionName>[]) =
        this.makeRawFeSectionPackArr(sectionName);
      return loginUser;
    }, {} as LoginUserNext);
  }

  sectionPackArr<SN extends SavableSectionName>(
    storeName: SN
  ): SectionPackDb<SN>[] {
    return this.core[storeName] as Record<
      keyof UserDbCore[SN],
      any
    > as SectionPackDb<SN>[];
  }
  firstSectionPackHeadSection<SN extends SavableSectionName>(sectionName: SN) {
    const firstPack = this.firstSectionPack(sectionName);
    const firstRawSection = firstPack.rawSectionArr(sectionName)[0];
    if (firstRawSection) return firstRawSection;
    else
      throw new Error(`There is no sectionPack in this.core[${sectionName}]`);
  }
  firstSectionPack<SN extends SavableSectionName>(
    storeName: SN
  ): SectionPackDb<SN> {
    const firstPack = this.sectionPackArr(storeName)[0];
    if (firstPack) return firstPack;
    else throw new Error(`There is no sectionPack in this.core[${storeName}]`);
  }
  makeRawFeSectionPackArr<SN extends SavableSectionName>(
    storeName: SN
  ): SectionPackRaw<SN>[] {
    // table is different just because it needs to update its rows
    if (sectionNameS.is(storeName, "tableNext")) {
      return this.makeTableSectionPackFeArr(storeName) as SectionPackRaw<SN>[];
    } else {
      return this.sectionPackArr(storeName).map(
        (dbPack) => dbPack.toFeSectionPack() as SectionPackRaw<SN>
      );
    }
  }
  makeTableSectionPackFeArr<SN extends SectionName<"tableNext">>(
    tableName: SN
  ): SectionPackRaw<SN>[] {
    const tableSectionPack = this.firstSectionPack(tableName);
    const tableSection = tableSectionPack.firstSection(tableName);

    const rowIds = tableSection.dbVarbs.rowIds as string[];
    const { tableIndexName } = sectionMetas.section(tableName).core;

    const sourceIds = this.sectionPackArr(tableIndexName).map(
      ({ dbId }) => dbId
    );
    const sourceIdsInCurrentRowIds = Arr.extract(rowIds, sourceIds);
    const restOfSourceIds = Arr.exclude(sourceIds, sourceIdsInCurrentRowIds);
    const nextRowIds = [...sourceIdsInCurrentRowIds, ...restOfSourceIds];

    tableSection.dbVarbs.rowIds = nextRowIds;
    return [tableSectionPack.toFeSectionPack()];
  }
  static init(userDbRaw: UserDbRaw): ServerUser {
    const core = savableNameS.arrs.all.reduce((userDbCore, storeName) => {
      if (storeName in userDbRaw) {
        (userDbCore[storeName] as SectionPackDb<typeof storeName>[]) = (
          userDbRaw[storeName] as SectionPackDbRaw<SectionName>[]
        ).map(
          (rawPack) => new SectionPackDb({ ...rawPack, sectionName: storeName })
        );
      } else {
        userDbCore[storeName] = [];
      }
      return userDbCore;
    }, {} as UserDbCore);

    return new ServerUser(core);
  }
}

type UserDbCore = {
  [SN in SavableSectionName]: SectionPackDb<SN>[];
};

export type UserDbRaw = {
  [SN in SavableSectionName]: SectionPackDbRaw<SN>[];
};

export function initDbSectionPack<SN extends SectionName>(
  sectionName: SN,
  fullDbVarbs?: DbVarbs
): SectionPackDbRaw<SN> {
  const sectionPack = SectionPack.init({
    sectionName,
    dbVarbs: fullDbVarbs,
  });
  return Obj.strictPick(sectionPack, ["dbId", "rawSections"]);
}

// makeNewTableRows(sectionName: SectionName<"rowIndex">) {
//   const tableName = rowIndexToTableName[sectionName];
//   const tableSectionPack = this.firstSectionPack(tableName);

//   const { rowSourceName } = sectionMetas.section(tableName).core;
//   const tableColumnSections = tableSectionPack.rawSectionArr("column");
//   const rowSourceArr = this.sectionPackArr(rowSourceName);

//   const indexRows: SectionPackRaw< SectionName<"rowIndex">>[] = [];
//   for (const sourceSectionPack of rowSourceArr) {
//     indexRows.push(
//       this.toRowIndexEntry(rowSourceName, sourceSectionPack, tableColumnSections)
//     );
//   }
// }
// toRowIndexEntry<SN extends SectionName<"rowIndex">>(
//   indexName: SN,
//   sourceSectionPack: SectionPackDb<SN>,
//   tableColumns: OneRawSection<"db", "column">[]
// ): SectionPackRaw< SN> {
//   // for now, there is very little type safety for dbEntry

//   const sourceSection = sourceSectionPack.headSection()

//   // const columns = this.sectionArr(tableEntry, "column");
//   const cellArr = tableColumns.reduce((cells, col) => {

//     const info = col.dbVarbs as InEntityVarbInfo;

//     const value = this.value(fullEntry, info);
//     cells.push({
//       dbId: col.dbId,
//       childDbIds: {},
//       dbVarbs: { ...info, value }
//     })
//     return cells;
//   }, [] as RawSection<"fe", "column">[]);

//   const { dbId } = fullEntry;

//   let rowEntry = this.initEntry(
//     indexName,
//     { title: sourceSection.dbVarbs.title },
//     { dbId }
//   );
//   rowEntry = this.addLikeChildren(
//     rowEntry,
//     cellArr,
//     "cell",
//     InfoS.db(indexName, dbId)
//   );
//   return rowEntry;
// }

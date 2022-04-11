import { sectionMetas } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas";
import {
  SectionNam,
  SectionName,
} from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { SectionPack } from "../../client/src/App/sharedWithServer/Analyzer/SectionPack";
import {
  SectionPackDbRaw,
  SectionPackRaw,
} from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { DbVarbs } from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw/RawSection";
import { LoginUserNext } from "../../client/src/App/sharedWithServer/Crud/Login";
import Arr from "../../client/src/App/sharedWithServer/utils/Arr";
import { Obj } from "../../client/src/App/sharedWithServer/utils/Obj";
import { SectionPackDb } from "./UserDbNext/SectionPackDb";

export class UserDbNext {
  constructor(readonly core: UserDbCore) {}
  makeRawFeLoginUser(): LoginUserNext {
    return SectionNam.arrs.fe.initOnLogin.reduce((loginUser, sectionName) => {
      (loginUser[sectionName] as SectionPackRaw<"fe", typeof sectionName>[]) =
        this.makeRawFeSectionPackArr(sectionName);
      return loginUser;
    }, {} as LoginUserNext);
  }
  sectionPackArr<SN extends SectionName<"dbStore">>(
    storeName: SN
  ): SectionPackDb<SN>[] {
    return this.core[storeName] as Record<
      keyof UserDbCore[SN],
      any
    > as SectionPackDb<SN>[];
  }
  firstSectionPack<SN extends SectionName<"dbStore">>(
    storeName: SN
  ): SectionPackDb<SN> {
    const firstPack = this.sectionPackArr(storeName)[0];
    if (firstPack) return firstPack;
    else throw new Error(`There is no sectionPack in this.core[${storeName}]`);
  }
  makeRawFeSectionPackArr<SN extends SectionName<"dbStore">>(
    storeName: SN
  ): SectionPackRaw<"fe", SN>[] {
    if (SectionNam.is(storeName, "table")) {
      return this.makeTableSectionPackFeArr(storeName) as SectionPackRaw<
        "fe",
        SN
      >[];
    } else {
      return this.sectionPackArr(storeName).map(
        (dbPack) => dbPack.toFeSectionPack() as SectionPackRaw<"fe", SN>
      );
    }
  }
  makeTableSectionPackFeArr<SN extends SectionName<"table">>(
    sectionName: SN
  ): SectionPackRaw<"fe", SN>[] {
    const tableSectionPack = this.firstSectionPack(sectionName);
    const tableSection = tableSectionPack.firstSection(sectionName);

    const rowIds = tableSection.dbVarbs.rowIds as string[];
    const { rowSourceName } = sectionMetas.section(sectionName).core;

    const sourceIds = this.sectionPackArr(rowSourceName).map(
      ({ dbId }) => dbId
    );
    const sourceIdsInCurrentRowIds = Arr.extract(rowIds, sourceIds);
    const restOfSourceIds = Arr.exclude(sourceIds, sourceIdsInCurrentRowIds);
    const nextRowIds = [...sourceIdsInCurrentRowIds, ...restOfSourceIds];

    tableSection.dbVarbs.rowIds = nextRowIds;
    return [tableSectionPack.toFeSectionPack()];
  }
  static init(userDbRaw: UserDbRaw): UserDbNext {
    const core = SectionNam.arrs.db.dbStore.reduce((userDbCore, storeName) => {
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

    return new UserDbNext(core);
  }
}

type UserDbCore = {
  [SN in SectionName<"dbStore">]: SectionPackDb<SN>[];
};

export type UserDbRaw = {
  [SN in SectionName<"dbStore">]: SectionPackDbRaw<SN>[];
};

export function initDbSectionPack<SN extends SectionName>(
  sectionName: SN,
  fullDbVarbs?: DbVarbs
): SectionPackDbRaw<SN> {
  const sectionPack = SectionPack.init({
    contextName: "db",
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

//   const indexRows: SectionPackRaw<"fe", SectionName<"rowIndex">>[] = [];
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
// ): SectionPackRaw<"fe", SN> {
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
//     Inf.db(indexName, dbId)
//   );
//   return rowEntry;
// }

import { LoginUser } from "../client/src/App/sharedWithServer/apiQueriesShared/login";
import { DbVarbs } from "../client/src/App/sharedWithServer/SectionPack/RawSection";
import { SectionPack } from "../client/src/App/sharedWithServer/SectionPack/SectionPack";
import {
  SectionPackDbRaw,
  SectionPackRaw,
} from "../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import {
  SectionName,
  sectionNameS,
} from "../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { SectionPackDb } from "./SectionPackDb";
import { ServerSectionName, serverSectionS } from "./ServerSectionName";

export class ServerUser {
  constructor(readonly core: UserDbCore) {}
  makeRawFeLoginUser(): LoginUser {
    return sectionNameS.arrs.loadOnLogin.reduce((loginUser, sectionName) => {
      (loginUser[sectionName] as SectionPackRaw<typeof sectionName>[]) =
        this.makeRawFeSectionPackArr(sectionName);
      return loginUser;
    }, {} as LoginUser);
  }

  sectionPackArr<SN extends ServerSectionName>(
    sectionName: SN
  ): SectionPackDb<SN>[] {
    return this.core[sectionName] as Record<
      keyof UserDbCore[SN],
      any
    > as SectionPackDb<SN>[];
  }
  firstSectionPackHeadSection<SN extends ServerSectionName>(sectionName: SN) {
    const firstPack = this.firstSectionPack(sectionName);
    // there is a sectionPack, it seems, but no arr
    const firstRawSection = firstPack.rawSectionArr(sectionName)[0];
    if (firstRawSection) return firstRawSection;
    else {
      throw new Error(
        `There is no sectionPack section in this.core[${sectionName}].rawSections`
      );
    }
  }
  firstSectionPack<SN extends ServerSectionName>(
    sectionName: SN
  ): SectionPackDb<SN> {
    // ok, so the sectionPackArr isn't being populated
    const firstPack = this.sectionPackArr(sectionName)[0];
    if (firstPack) return firstPack;
    else {
      throw new Error(`There is no sectionPack in this.core[${sectionName}]`);
    }
  }
  makeRawFeSectionPackArr<SN extends SavableSectionName>(
    storeName: SN
  ): SectionPackRaw<SN>[] {
    // I'm not creating all the tables at the outset, I guess.
    if (sectionNameS.is(storeName, "tableName")) {
      return this.makeTableSectionPackFeArr(storeName) as SectionPackRaw<SN>[];
    } else {
      return this.sectionPackArr(storeName).map(
        (dbPack) => dbPack.toFeSectionPack() as SectionPackRaw<SN>
      );
    }
  }
  makeTableSectionPackFeArr<SN extends SectionName<"tableName">>(
    tableName: SN
  ): SectionPackRaw<SN>[] {
    const tableSectionPack = this.firstSectionPack(tableName);
    return [tableSectionPack.toFeSectionPack()];
  }
  static init(userDbRaw: UserDbRaw): ServerUser {
    const core = serverSectionS.arrs.all.reduce((userDbCore, storeName) => {
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
  [SN in ServerSectionName]: SectionPackDb<SN>[];
};

export type UserDbRaw = {
  [SN in ServerSectionName]: SectionPackDbRaw<SN>[];
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

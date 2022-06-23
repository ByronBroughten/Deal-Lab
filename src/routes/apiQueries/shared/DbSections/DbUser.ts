import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import {
  SectionName,
  sectionNameS,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { PackLoaderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackLoaderSection";
import { UpdaterSection } from "../../../../client/src/App/sharedWithServer/StateUpdaters/UpdaterSection";
import { HandledResStatusError } from "../../../../resErrorUtils";
import { ServerUser } from "../../../ServerUser";
import { DbSectionsProps } from "./Bases/DbSectionsBase";
import { DbSections } from "./DbSections";
import { DbSectionsQuerier } from "./DbSectionsQuerier";
import { DbSectionsRaw } from "./DbSectionsQuerierTypes";
import { checkUserAuthToken, makeUserAuthToken } from "./DbUser/userAuthToken";

interface DbUserProps extends GetterSectionsProps {
  dbSections: DbSections;
}

type FullLoginArrs = {
  [SN in SectionName<"fullLoadOnLogin">]: SectionPackRaw<SN>[];
};
type TableLoginArrs = {
  [SN in SectionName<"tableLoadOnLogin">]: SectionPackRaw<SN>[];
};

export class DbUser extends GetterSectionsBase {
  dbSections: DbSections;
  constructor({ dbSections, ...rest }: DbUserProps) {
    super(rest);
    this.dbSections = dbSections;
  }
  get dbSectionsRaw(): DbSectionsRaw {
    return this.dbSections.dbSectionsRaw;
  }
  get userId(): string {
    const userId = this.dbSectionsRaw._id as mongoose.Types.ObjectId;
    return userId.toHexString();
  }
  static init(props: DbSectionsProps) {
    const dbSections = new DbSections(props);
    const userPack = dbSections.onlySectionPack("user");
    const serverUserPack = dbSections.onlySectionPack("serverOnlyUser");
    const omniLoader = new PackLoaderSection(
      UpdaterSection.initOmniParentProps()
    );
    omniLoader.loadChildSectionPack(userPack);
    omniLoader.loadChildSectionPack(serverUserPack);
    return new DbUser({
      ...omniLoader.getterSectionsProps,
      dbSections,
    });
  }
  static async queryByEmail(email: string): Promise<DbUser> {
    const querier = await DbSectionsQuerier.initByEmail(email);
    const dbSectionsRaw = await querier.getDbSectionsRaw();
    return DbUser.init({
      dbSectionsRaw,
    });
  }
  get get(): GetterSection<"user"> {
    return new GetterSection({
      ...this.stateSections.onlyOneRawSection("user"),
      ...this.getterSectionsProps,
    });
  }
  get serverOnlyUser(): GetterSection<"serverOnlyUser"> {
    return this.get.onlyCousin("serverOnlyUser");
  }
  async validatePassword(attemptedPassword: string): Promise<void> {
    const encryptedPassword = this.serverOnlyUser.value(
      "encryptedPassword",
      "string"
    );
    const isValid = await bcrypt.compare(attemptedPassword, encryptedPassword);
    if (!isValid) {
      throw new HandledResStatusError({
        resMessage: "That password is incorrect.",
        status: 400,
      });
    }
  }
  // // grabbed right out of the db
  // "user",
  // "outputList",
  // "varbList",
  // "singleTimeList",
  // "ongoingList",

  // // whipped up from their corresponding stores
  // "propertyTableStore",
  // "dealTableStore",
  // "loanTableStore",
  // "mgmtTableStore",
  makeLoginUser() {
    return {
      ...this.getFullLoginArrs(),
      ...this.makeTableLoginArrs(),
    };
  }
  getFullLoginArrs(): FullLoginArrs {
    return sectionNameS.arrs.fullLoadOnLogin.reduce((fullArrs, sectionName) => {
      (fullArrs as any)[sectionName] =
        this.dbSections.sectionPackArr(sectionName);
      return fullArrs;
    }, {} as FullLoginArrs);
  }
  makeTableLoginArrs(): TableLoginArrs {
    return sectionNameS.arrs.tableLoadOnLogin.reduce(
      (tableArrs, sectionName) => {
        (tableArrs as any)[sectionName] = this.makeTablePackArr(sectionName);
        return tableArrs;
      },
      {} as TableLoginArrs
    );
  }
  makeTablePackArr<SN extends SectionName<"tableLoadOnLogin">>(
    sectionName: SN
  ) {
    const omniParent = PackBuilderSection.initAsOmniParent();
    const tableStore = omniParent.addAndGetChild(sectionName);
    const table = tableStore.addAndGetChild("table");

    // I must load the default columns.
    // or rather, the default table.
    const columns = table.children("column");

    const sourceName = tableStore.get.meta.core.tableSource;
    omniParent.loadChildren({
      sectionName: sourceName,
      sectionPacks: this.dbSections.sectionPackArr(sourceName),
    });

    for (const section of omniParent.get.children(sourceName)) {
    }
  }
  // makeNewTableRows(sectionName: SectionName<"rowIndex">) {
  //   const tableName = rowIndexToTableName[sectionName];
  //   const tableSectionPack = this.firstSectionPack(tableName);

  //   const { rowSourceName } = sectionsMeta.section(tableName).core;
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
  sendLogin(res: Response) {
    const serverUser = ServerUser.init(this.dbSectionsRaw);
    const loggedInUser = serverUser.makeRawFeLoginUser();

    // change the login req so that loginUser is RawSectionPack<"main">
    // re-implement the serverUser "makeRawFeLoginUser" to essentially
    //   construct a "main" sectionPack

    const token = this.makeUserAuthToken();
    res
      .header(constants.tokenKey.apiUserAuth, token)
      .status(200)
      .send(loggedInUser);
  }
  makeUserAuthToken() {
    return DbUser.makeUserAuthToken(this.userId);
  }
  static checkUserAuthToken = checkUserAuthToken;
  static makeUserAuthToken = makeUserAuthToken;
}

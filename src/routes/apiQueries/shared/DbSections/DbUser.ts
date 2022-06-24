import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { LoginUser } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/login";
import {
  RegisterFormData,
  RegisterReqBody,
} from "../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { defaultMaker } from "../../../../client/src/App/sharedWithServer/defaultMaker/defaultMaker";
import { SectionPackRaw } from "../../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { SafeDbVarbs } from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSections/rel/valueMetaTypes";
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
import { DbSectionsProps } from "./Bases/DbSectionsBase";
import { DbSections } from "./DbSections";
import { DbSectionsQuerier } from "./DbSectionsQuerier";
import { DbSectionsRaw } from "./DbSectionsQuerierTypes";
import { checkUserAuthToken, makeUserAuthToken } from "./DbUser/userAuthToken";
import { userPrepS } from "./DbUser/userPrepS";

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
    if (!(userId instanceof mongoose.Types.ObjectId))
      throw new Error(`userId "${userId}" is not valid.`);
    return userId.toHexString();
  }
  private static init(props: DbSectionsProps) {
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
  static async createAndSaveNew({
    registerFormData,
    guestAccessSections,
    _id,
  }: RegisterReqBody & {
    _id?: mongoose.Types.ObjectId;
  }): Promise<DbSectionsRaw> {
    const userPackArrs = await userPrepS.initUserSectionPacks(registerFormData);
    const dbSectionsRaw = userPrepS.makeDbSectionsRaw({
      ...userPackArrs,
      ...guestAccessSections,
      _id,
    });
    await dbSectionsRaw.save();
    return dbSectionsRaw;
  }
  static async initUserSections(
    registerFormData: RegisterFormData
  ): Promise<UserSections> {
    const { email, emailAsSubmitted } = userPrepS.processEmail(
      registerFormData.email
    );
    await userPrepS.checkThatEmailIsUnique(email);
    return {
      user: {
        userName: registerFormData.userName,
        email,
        apiAccessStatus: "basicStorage",
      },
      serverOnlyUser: {
        emailAsSubmitted,
        encryptedPassword: await userPrepS.encryptPassword(
          registerFormData.password
        ),
      },
    };
  }
  static async queryByEmail(email: string): Promise<DbUser> {
    const querier = await DbSectionsQuerier.initByEmail(email);
    return DbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
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
  makeLoginUser(): LoginUser {
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
  ): SectionPackRaw<SN>[] {
    const omniParent = PackBuilderSection.initAsOmniParent();
    const tableStore = omniParent.addAndGetChild(sectionName);

    const sourceName = tableStore.sectionMeta.tableSourceName;
    const tablePack = defaultMaker.makeMainTablePack[sourceName]();
    const defaultTable = tableStore.loadAndGetChild(tablePack);

    const sources = omniParent.loadAndGetChildren({
      sectionName: sourceName,
      sectionPacks: this.dbSections.sectionPackArr(sourceName),
    });

    // You need to create "TableUpdater" and use it in
    // both this and SetterTable.
    const columns = defaultTable.get.children("column");
    for (const source of sources) {
      for (const column of columns) {
        const title = source.get.value("title", "string");
        const { dbId } = source.get;
        defaultTable.addAndGetChild("tableRow", {
          dbId,
          dbVarbs: { title },
        });
        const varb = source.get.varbs.varbByFocalMixed(
          column.varbs.varbInfoValues
        );
      }
    }
    return [tableStore.makeSectionPack()];
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
    const loggedInUser = this.makeLoginUser();
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

export interface UserSections {
  user: SharedUser;
  serverOnlyUser: ServerOnlyUser;
}

type SharedUser = SafeDbVarbs<"user">;
type ServerOnlyUser = SafeDbVarbs<"serverOnlyUser">;

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
import {
  isFeStoreTableName,
  relChildSections,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relChildSections";
import { SafeDbVarbs } from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsUtils/rel/valueMetaTypes";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
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
    const omniLoader = PackBuilderSection.initAsOmniParent();
    omniLoader.loadChild({
      childName: "user",
      sectionPack: dbSections.onlySectionPack("user"),
    });
    omniLoader.loadChild({
      childName: "serverOnlyUser",
      sectionPack: dbSections.onlySectionPack("serverOnlyUser"),
    });
    return new DbUser({
      ...omniLoader.getterSectionsProps,
      dbSections,
    });
  }
  static async createAndSaveNew({
    registerFormData,
    guestAccessSections,
    _id,
  }: CreateUserProps): Promise<string> {
    const userPackArrs = await userPrepS.initUserSectionPacks(registerFormData);
    const dbSectionsRaw = userPrepS.makeDbSectionsRaw({
      ...userPackArrs,
      ...guestAccessSections,
      _id,
    });
    await dbSectionsRaw.save();
    return dbSectionsRaw._id.toHexString();
  }
  static async createSaveGet(props: CreateUserProps): Promise<DbUser> {
    const userId = await this.createAndSaveNew(props);
    return DbUser.queryByUserId(userId);
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
  static async queryByUserId(userId: string): Promise<DbUser> {
    const querier = await DbSectionsQuerier.initByUserId(userId);
    return DbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
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
  makeLoginUser(): LoginUser {
    const omniParent = PackBuilderSection.initAsOmniParent();
    const feStore = PackBuilderSection.initAsOmniChild("feStore");
    feStore.loadSelf(defaultMaker.makeSectionPack("feStore"));
    for (const feStoreChildName of feStore.get.childNames) {
      if (isFeStoreTableName(feStoreChildName)) {
        const table = feStore.onlyChild(feStoreChildName);
        const { tableRowDbSource } = relChildSections.feStore[feStoreChildName];
        const dbSourceSn = this.sectionsMeta
          .section("dbStore")
          .childType(tableRowDbSource);
        const { dbIndexStoreName } = this.sectionsMeta.section(dbSourceSn);
        const dbSources = omniParent.loadAndGetChildren({
          childName: dbSourceSn,
          sectionPacks: this.dbSections.sectionPackArr(dbIndexStoreName),
        });
        const columns = table.get.children("column");
        for (const source of dbSources) {
          for (const column of columns) {
            const title = source.get.value("title", "string");
            const { dbId } = source.get;
            table.addAndGetChild("tableRow", {
              dbId,
              dbVarbs: { title },
            });
            const varb = source.get.varbByFocalMixed(column.varbInfoValue());
          }
        }
      } else {
        feStore.loadChildren({
          childName: feStoreChildName,
          sectionPacks: this.dbSections.sectionPackArr(feStoreChildName),
        });
      }
    }

    return {
      feStore: [feStore.makeSectionPack()],
    };
  }

  // makeNewTableRows(sectionName: SectionName<"rowIndex">) {
  //   const tableName = rowIndexToTableName[sectionName];
  //   const tableSectionPack = this.firstSectionPack(tableName);

  //   const { rowSourceName } = sectionsMeta.section(tableName).core;
  //   const tableColumnSections = tableSectionPack.rawSectionArr("column");
  //   const rowSourceArr = this.sectionPackArr(rowSourceName);

  //   const indexRows: SectionPack< SectionName<"rowIndex">>[] = [];
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
  // ): SectionPack< SN> {
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
  //     MixedInfoS.makeDb(indexName, dbId, "onlyOne")
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

interface CreateUserProps extends RegisterReqBody {
  _id?: mongoose.Types.ObjectId;
}

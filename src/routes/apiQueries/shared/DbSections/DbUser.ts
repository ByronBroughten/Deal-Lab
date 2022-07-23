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
  ApiStorageAuth,
  isApiAccessStatus,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import {
  isFeStoreTableName,
  relChildSections,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relChildSections";
import { SectionValues } from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsUtils/valueMetaTypes";
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
import {
  checkUserAuthToken,
  createUserAuthToken,
} from "./DbUser/userAuthToken";
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
        apiStorageAuth: "basicStorage",
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
  get apiStorageAuth(): ApiStorageAuth {
    const apiStorageAuth = this.get.value("apiStorageAuth");
    if (!isApiAccessStatus(apiStorageAuth)) {
      throw new Error(`Invalid apiStorageAuth of ${apiStorageAuth}`);
    }
    return apiStorageAuth;
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

        const sourcePacks = this.dbSections.sectionPackArr(dbIndexStoreName);
        const columns = table.get.children("column");
        for (const sourcePack of sourcePacks) {
          const source = PackBuilderSection.loadAsOmniChild(sourcePack);
          const displayName = source.get.value("displayName", "string");
          const row = table.addAndGetChild("tableRow", {
            dbId: source.get.dbId,
            dbVarbs: { displayName },
          });
          for (const column of columns) {
            const varb = source.get.varbByFocalMixed(
              column.valueInEntityInfo()
            );
            row.addChild("cell", {
              dbId: column.dbId,
              dbVarbs: {
                displayVarb: varb.displayVarb(),
                valueEntityInfo: column.valueInEntityInfo(),
              },
            });
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
  sendLogin(res: Response) {
    const loggedInUser = this.makeLoginUser();
    const token = this.createUserAuthToken();
    res
      .header(constants.tokenKey.apiUserAuth, token)
      .status(200)
      .send(loggedInUser);
  }
  createUserAuthToken() {
    return DbUser.createUserAuthToken(this.userId);
  }
  static checkUserAuthToken = checkUserAuthToken;
  static createUserAuthToken = createUserAuthToken;
}

export interface UserSections {
  user: SharedUser;
  serverOnlyUser: ServerOnlyUser;
}

type SharedUser = SectionValues<"user">;
type ServerOnlyUser = SectionValues<"serverOnlyUser">;

interface CreateUserProps extends RegisterReqBody {
  _id?: mongoose.Types.ObjectId;
}

import mongoose, { Document } from "mongoose";
import { SelfOrDescendantSectionName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DescendantSectionName";
import { ResStatusError } from "../../../../resErrorUtils";
import { DbSectionsModelCore } from "../../../DbSectionsModel";
import { ServerSectionName, ServerStoreName } from "../../../ServerStoreName";

export const queryOptions = {
  new: true,
  lean: true,
  useFindAndModify: false,
} as const;

export class UserNotFoundError extends ResStatusError {}
export class SectionPackNotFoundError extends ResStatusError {}
export interface DbSectionsRaw extends DbSectionsModelCore, Document<any, any> {
  _id: mongoose.Types.ObjectId;
}

interface FirstRawSectionProps<CN extends ServerStoreName> {
  dbStoreName: CN;
  selfOrDescendantName: SelfOrDescendantSectionName<ServerSectionName<CN>>;
}

interface FirstRawVarbProps<SN extends ServerStoreName>
  extends FirstRawSectionProps<SN> {
  varbName: string;
}

const dbSectionsPaths = {
  first(dbStoreName: ServerStoreName) {
    return `${dbStoreName}.0`;
  },
  firstRawSection<SN extends ServerStoreName>({
    dbStoreName,
    selfOrDescendantName,
  }: FirstRawSectionProps<SN>) {
    return `${this.first(dbStoreName)}.rawSections.${selfOrDescendantName}.0`;
  },
  firstRawVarb<SN extends ServerStoreName>({
    varbName,
    ...props
  }: FirstRawVarbProps<SN>) {
    return `${this.firstRawSection(props)}.dbVarbs.${varbName}`;
  },
};

export const dbSectionsFilters = {
  userId(userId: string) {
    return { _id: userId };
  },
  email(email: string) {
    const path = dbSectionsPaths.firstRawVarb({
      dbStoreName: "user",
      selfOrDescendantName: "user",
      varbName: "email",
    });
    return { [path]: email };
  },
};

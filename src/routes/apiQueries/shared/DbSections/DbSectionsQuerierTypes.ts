import { Document } from "mongoose";
import { SelfOrDescendantName } from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { ResStatusError } from "../../../../resErrorUtils";
import { ServerSectionName } from "../../../ServerSectionName";
import { UserDbRaw } from "../../../ServerUser";

export const queryOptions = {
  new: true,
  lean: true,
  useFindAndModify: false,
} as const;

export class UserNotFoundError extends ResStatusError {}
export class SectionPackNotFoundError extends ResStatusError {}
export interface DbSectionsRaw extends UserDbRaw, Document<any, any> {}

interface FirstRawSectionProps<SN extends ServerSectionName> {
  sectionName: SN;
  selfOrDescendantName: SelfOrDescendantName<SN>;
}

interface FirstRawVarbProps<SN extends ServerSectionName>
  extends FirstRawSectionProps<SN> {
  varbName: string;
}

const dbSectionsPaths = {
  first(sectionName: ServerSectionName) {
    return `${sectionName}.0`;
  },
  firstRawSection<SN extends ServerSectionName>({
    sectionName,
    selfOrDescendantName,
  }: FirstRawSectionProps<SN>) {
    return `${this.first(sectionName)}.rawSections.${selfOrDescendantName}.0`;
  },
  firstRawVarb<SN extends ServerSectionName>({
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
      sectionName: "user",
      selfOrDescendantName: "user",
      varbName: "email",
    });
    return { [path]: email };
  },
};

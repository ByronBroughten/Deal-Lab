import { Schema } from "mongoose";
import {
  reqMonDbId,
  reqMonString,
} from "../../../sharedWithServer/utils/mongoose";
import { DbEntry, DbSection } from "../../../sharedWithServer/Analyzer/DbEntry";

export function getMonDbSection() {
  const schemaFrame: Record<keyof DbSection, any> = {
    dbId: reqMonDbId,
    dbVarbs: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    childDbIds: {
      type: Map,
      of: [reqMonString],
    },
  };
  return new Schema(schemaFrame);
}
export function getMonDbEntry() {
  const schemaFrame: Record<keyof DbEntry, any> = {
    dbId: reqMonDbId,
    dbSections: {
      type: Map,
      of: [getMonDbSection()],
    },
  };
  return new Schema(schemaFrame);
}

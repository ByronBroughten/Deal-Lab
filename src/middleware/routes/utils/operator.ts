import { DbEntry } from "../../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { DbStoreName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";

type RightSide<T extends any> = Partial<Record<DbStoreName, T>>;
type QueryOperators = {
  EntryPuller: { $pull: RightSide<{ [selector: string]: any }> };
  EntryPusher: { $push: RightSide<DbEntry> };
  EntryArrSetter: { $set: RightSide<DbEntry[]> };
};
type QueryOpName = keyof QueryOperators;
export type QueryOp<O extends QueryOpName = QueryOpName> = QueryOperators[O];
export const queryOp = {
  set: {
    entryArr(
      dbEntryArr: DbEntry[],
      storeName: DbStoreName
    ): QueryOp<"EntryArrSetter"> {
      return { $set: { [storeName]: dbEntryArr } };
    },
  },
  push: {
    entry(entry: DbEntry, sectionName: string): QueryOp<"EntryPusher"> {
      return { $push: { [sectionName]: entry } };
    },
  },
  pull: {
    entry(entryId: string, sectionName: string): QueryOp<"EntryPuller"> {
      return { $pull: { [sectionName]: { dbId: entryId } } };
    },
  },
};

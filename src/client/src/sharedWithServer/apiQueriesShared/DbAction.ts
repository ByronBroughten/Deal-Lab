import { Id } from "../Ids/IdS";
import { SectionPack } from "../SectionPacks/SectionPack";
import {
  StoreName,
  StoreSectionName,
  validateStoreName,
} from "../sectionStores";
import { validateDbSectionPack } from "../sectionVarbsConfigDerived/sectionChildrenDerived/DbSectionPack";
import { Obj } from "../utils/Obj";

const dbActionNames = ["add", "update", "remove"] as const;
function validateDbActionName(value: any): DbActionName {
  if (dbActionNames.includes(value)) return value;
  else throw new Error(`value "${value}" is not a DbActionName.`);
}
type DbActionName = (typeof dbActionNames)[number];
export type DbAction = DbAdd | DbUpdate | DbRemove;

type CheckDbAction<T extends { changeName: DbActionName }> = T;
type _Test = CheckDbAction<DbAction>;

export function validateDbAction(value: any): DbAction {
  const obj = Obj.validateObjToAny(value) as DbAction;
  const changeName = validateDbActionName(obj.changeName);
  switch (changeName) {
    case "remove": {
      return {
        changeName,
        ...validateStoreNameAndDbId(
          Obj.strictPick(obj as DbRemove, ["storeName", "dbId"])
        ),
      };
    }
    case "add":
    case "update": {
      return {
        changeName,
        ...validateStoreNameAndSectionPack(
          Obj.strictPick(obj as DbAdd | DbUpdate, ["storeName", "sectionPack"])
        ),
      };
    }
  }
}

type StoreNameAndDbId = { storeName: StoreName; dbId: string };
function validateStoreNameAndDbId(value: any): StoreNameAndDbId {
  const obj = Obj.validateObjToAny(value) as StoreNameAndDbId;
  return {
    storeName: validateStoreName(obj.storeName),
    dbId: Id.validate(obj.dbId),
  };
}

function validateStoreNameAndSectionPack(value: any): StoreNameAndSectionPack {
  const obj = Obj.validateObjToAny(value) as StoreNameAndSectionPack;
  const storeName = validateStoreName(obj.storeName);
  return {
    storeName,
    sectionPack: validateDbSectionPack(obj.sectionPack, storeName),
  };
}

type StoreNameAndSectionPack<CN extends StoreName = StoreName> = {
  storeName: CN;
  sectionPack: SectionPack<StoreSectionName<CN>>;
};

export interface DbAdd<CN extends StoreName = StoreName>
  extends StoreNameAndSectionPack<CN> {
  changeName: "add";
}
export interface DbUpdate<CN extends StoreName = StoreName>
  extends StoreNameAndSectionPack<CN> {
  changeName: "update";
}
export interface DbRemove extends StoreNameAndDbId {
  changeName: "remove";
}

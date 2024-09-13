import { StoreId } from "../../../StateGetters/Identifiers/StoreId";
import {
  SectionPack,
  validateSectionPack,
} from "../../../StateTransports/SectionPack";
import { ValidationError } from "../../../utils/Error";
import { IdS } from "../../../utils/IdS";
import { Obj } from "../../../utils/Obj";

function validateChangeToSave(value: any): ChangeToSave {
  const obj = Obj.validateObjToAny(value) as ChangeToSave;
  validateChangeName(obj.changeName);
  if (obj.changeName === "remove") {
    return {
      changeName: obj.changeName,
      dbId: IdS.validate(obj.dbId),
    };
  } else {
    return { changeName: obj.changeName };
  }
}

export function validateChangesToSave(value: any): ChangesToSave {
  const obj = Obj.validateObjToAny(value) as ChangesToSave;
  for (const storeId of Obj.keys(obj)) {
    StoreId.validate(storeId);
    validateChangeToSave(obj[storeId]);
  }
  return obj;
}

export function isChangesToSave(value: any): value is ChangesToSave {
  try {
    validateChangesToSave(value);
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      return false;
    } else {
      throw err;
    }
  }
}

export function validateChangeSaving(value: any): ChangeSaving {
  const obj = Obj.validateObjToAny(value) as ChangeSaving;
  validateChangeName(obj.changeName);
  if (obj.changeName === "remove") {
    return {
      changeName: obj.changeName,
      dbId: IdS.validate(obj.dbId),
    };
  } else {
    return {
      changeName: obj.changeName,
      sectionPack: validateSectionPack(obj.sectionPack),
    };
  }
}

export function validateChangesSaving(value: any): ChangesSaving {
  const obj = Obj.validateObjToAny(value) as ChangesSaving;
  for (const storeId of Obj.keys(obj)) {
    StoreId.validate(storeId);
    validateChangeSaving(obj[storeId]);
  }
  return obj;
}

export type ChangesToSave = {
  [storeId: string]: ChangeToSave;
};

export type ChangeToSave =
  | { changeName: "add" }
  | { changeName: "update" }
  | { changeName: "remove"; dbId: string };

export function isChangesSaving(value: any): value is ChangesSaving {
  try {
    validateChangesSaving(value);
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      return false;
    } else {
      throw err;
    }
  }
}

export type ChangesSaving = {
  [storeId: string]: ChangeSaving;
};

export type ChangeSaving =
  | { changeName: "add"; sectionPack: SectionPack }
  | { changeName: "update"; sectionPack: SectionPack }
  | { changeName: "remove"; dbId: string };

export function changeSavingToToSave(saving: ChangeSaving): ChangeToSave {
  switch (saving.changeName) {
    case "add":
    case "update": {
      return { changeName: saving.changeName };
    }
    case "remove": {
      return saving;
    }
  }
}

type ChangeGeneric = { changeName: ChangeName };
const changeNames = ["add", "update", "remove"] as const;
function validateChangeName(value: any): ChangeName {
  if (changeNames.includes(value)) {
    return value;
  } else {
    throw new ValidationError(`value "${value}" is not a changeName`);
  }
}
type ChangeName = (typeof changeNames)[number];
type CheckUpdateValues<T extends ChangeGeneric> = T;
type _TestSaving = CheckUpdateValues<ChangesSaving[string]>;
type _TestToSave = CheckUpdateValues<ChangesToSave[string]>;

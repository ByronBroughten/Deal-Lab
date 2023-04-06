import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import {
  isSectionPack,
  SectionPack,
} from "../../sectionChildrenDerived/SectionPack";

export type SectionUpdates = Record<string, number>;
function isSectionUpdates(value: any): value is SectionUpdates {
  return (
    typeof value === "object" &&
    Obj.keys(value).every((val) => typeof val === "string") &&
    Obj.values(value).every((val) => typeof val === "number")
  );
}

const zSectionUpdates = z.record(zS.number);
export const sectionUpdatesMeta = {
  is: isSectionUpdates,
  initDefault: () => ({}),
  zod: zSectionUpdates,
  mon: {
    type: Schema.Types.Mixed,
    required: false,
    validate: {
      validator: (v: any) => zSectionUpdates.safeParse(v).success,
    },
  },
};

export const sectionUpdateSchemas = {
  sectionUpdates: {
    is: isSectionUpdates,
    initDefault: () => ({}),
    zod: zSectionUpdates,
    mon: {
      type: Schema.Types.Mixed,
      required: false,
      validate: {
        validator: (v: any) => zSectionUpdates.safeParse(v).success,
      },
    },
  },
  changesToSave: {
    is: isChangesToSave,
    initDefault: () => ({}),
    zod: z.any(),
    mon: {
      type: Schema.Types.Mixed,
      required: false,
      validate: {
        validator: (v: any) => z.any().safeParse(v).success,
      },
    },
  },
  changesSaving: {
    is: isChangesSaving,
    initDefault: () => ({}),
    zod: z.any(),
    mon: {
      type: Schema.Types.Mixed,
      required: false,
      validate: {
        validator: (v: any) => z.any().safeParse(v).success,
      },
    },
  },
} as const;
function isChangesToSave(value: any): value is ChangesToSave {
  return (
    Obj.isObjToRecord(value) &&
    Obj.keys(value).every((sectionId) => {
      const sectionVals = value[sectionId] as ChangeToSave;
      return (
        sectionVals.changeName === "add" ||
        sectionVals.changeName === "update" ||
        (sectionVals.changeName === "remove" && sectionVals.dbId)
      );
    })
  );
}

export type ChangesToSave = {
  [sectionId: string]: ChangeToSave;
};

export type ChangeToSave =
  | { changeName: "add" }
  | { changeName: "update" }
  | { changeName: "remove"; dbId: string };

function isChangesSaving(value: any): value is ChangesSaving {
  return (
    Obj.isObjToRecord(value) &&
    Obj.keys(value).every((sectionId) => {
      const sectionVals = value[sectionId] as ChangeSaving;
      return (
        (sectionVals.changeName === "add" &&
          isSectionPack(sectionVals.sectionPack)) ||
        (sectionVals.changeName === "update" &&
          isSectionPack(sectionVals.sectionPack)) ||
        (sectionVals.changeName === "remove" && sectionVals.dbId)
      );
    })
  );
}

export type ChangesSaving = {
  [sectionId: string]: ChangeSaving;
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
function isChangeName(value: any): value is ChangeName {
  return changeNames.includes(value);
}
type ChangeName = typeof changeNames[number];
type CheckUpdateValues<T extends ChangeGeneric> = T;
type _TestSaving = CheckUpdateValues<ChangesSaving[string]>;
type _TestToSave = CheckUpdateValues<ChangesToSave[string]>;

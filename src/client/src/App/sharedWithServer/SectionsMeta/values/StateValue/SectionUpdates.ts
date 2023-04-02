import { Schema } from "mongoose";
import { z } from "zod";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";

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

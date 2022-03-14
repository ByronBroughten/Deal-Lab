import { z } from "zod";
import { dbLimits } from "./validatorConstraints";

export const message = {
  min: (num: number) => {
    return `${num} characters minimum`;
  },
  max: (num: number) => {
    return `${num} characters max`;
  },
  email: "Valid email required",
};

export const zNanoId = z
  .string()
  .max(dbLimits.dbId.length)
  .min(dbLimits.dbId.length);
export const zString = z.string().max(dbLimits.string.maxLength);
export const zNumber = z
  .number()
  .max(dbLimits.number.max)
  .min(dbLimits.number.min);
export function zValidate(value: any, zSchema: z.ZodTypeAny): boolean {
  try {
    zSchema.parse(value);
    return true;
  } catch (err) {
    return false;
  }
}

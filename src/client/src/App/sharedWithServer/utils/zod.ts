import { z } from "zod";
import {
  maxNumber,
  maxStringLength,
  nanoIdLength,
} from "./validatorConstraints";

export const message = {
  min: (num: number) => {
    return `${num} characters minimum`;
  },
  max: (num: number) => {
    return `${num} characters max`;
  },
  email: "Valid email required",
};

// analysisIndex title is undefined.
// that makes sense.

export const zNanoId = z.string().max(nanoIdLength).min(nanoIdLength);
export const zString = z.string().max(maxStringLength);
export const zNumber = z.number().max(maxNumber);
export function zValidate(value: any, zSchema: z.ZodTypeAny): boolean {
  try {
    zSchema.parse(value);
    return true;
  } catch (err) {
    return false;
  }
}

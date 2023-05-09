import { z } from "zod";
import { ValidationError } from "../../utils/Error";
import { StateValue } from "./StateValue";
import {
  unionValueArr,
  UnionValueName,
  unionValueNames,
} from "./StateValue/unionValues";
import { ValueMeta } from "./valueMetaGeneric";

function makeUnionMeta<UN extends UnionValueName>(
  valueName: UN
): ValueMeta<UN> {
  const valueArr = unionValueArr(valueName);
  const first = valueArr[0];
  const zodSchema = z.union([
    z.literal(first),
    z.literal(first),
    ...valueArr.map((str) => z.literal(str)),
  ]);
  return {
    is: (value): value is StateValue<UN> =>
      (valueArr as readonly any[]).includes(value),
    validate: (value: any): StateValue<UN> => {
      if ((valueArr as readonly any[]).includes(value)) {
        return value;
      } else {
        throw new ValidationError(
          `value "${value}" is not of type ${valueName}`
        );
      }
    },
    initDefault: () => first as StateValue<UN>,
    zod: zodSchema,
  };
}

type UnionMetas = {
  [UN in UnionValueName]: ValueMeta<UN>;
};

export const unionMetas = unionValueNames.reduce((metas, valueName) => {
  metas[valueName] = makeUnionMeta(valueName) as any;
  return metas;
}, {} as UnionMetas);

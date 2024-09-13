import { ValidationError } from "../../utils/Error";
import { ValueTraits } from "./checkValueTraits";
import { StateValue } from "./StateValue";
import {
  unionValueArr,
  UnionValueName,
  unionValueNames,
} from "./StateValue/unionValues";

function makeUnionMeta<UN extends UnionValueName>(
  valueName: UN
): ValueTraits<UN> {
  const valueArr = unionValueArr(valueName);
  const first = valueArr[0];
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
  };
}

type UnionMetas = {
  [UN in UnionValueName]: ValueTraits<UN>;
};

export const unionMetas = unionValueNames.reduce((metas, valueName) => {
  metas[valueName] = makeUnionMeta(valueName) as any;
  return metas;
}, {} as UnionMetas);

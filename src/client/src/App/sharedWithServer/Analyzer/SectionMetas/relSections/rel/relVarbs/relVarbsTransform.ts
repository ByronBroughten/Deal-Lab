import { omit } from "lodash";
import { BaseName } from "../../BaseName";
import { GeneralRelVarbs } from "../relVarbs";

type RelVarbToSumNum<
  SN extends BaseName,
  VN extends VarbName<SN>,
  RV extends GeneralRelVarb<"numObj">
> = RelVarb<
  "numObj",
  RV["displayName"],
  Merge<
    RV,
    {
      initValue: 0;
      updateInfoArr: [
        {
          updateName: "sumNums";
          updateProps: {
            nums: [
              {
                sectionName: SN;
                varbName: VN;
                idType: "relId";
                id: "children";
                context: "fe";
              }
            ];
          };
        }
      ];
    }
  >
>;

export const relVarbTransforms = {
  sumSection<
    SN extends BaseName<"all">,
    CSN extends BaseName<"all">,
    CRV extends GeneralRelVarbs<CSN>,
    ToSkip extends readonly (keyof CRV)[] = []
  >(sectionName: SN, childName: CSN, rvs: CRV, toSkip?: ToSkip) {
    type SumSectionRelVarbs<
      SN extends BaseName,
      RV extends GeneralRelVarbs<SN, "numObj">
    > = {
      [Prop in keyof RV]: RelVarbToSumNum<
        SN,
        Prop & VarbName<SN>,
        RV[Prop] & GeneralRelVarb<"numObj">
      >;
    };

    const numObjRelVarbs = this.filterByValueName(childName, "numObj", rvs);
    const all = Obj.keys(numObjRelVarbs).reduce((next, varbName) => {
      const rv = numObjRelVarbs[varbName];
      next[varbName] = relVarb.type(
        rv.valueName,
        rv.displayName,
        Obj.merge(rv, {
          updateName: "sumNums",
          updateProps: {
            nums: [
              {
                sectionName,
                varbName,
                idType: "relId",
                id: "children",
                context: "fe",
              },
            ],
          },
        } as const)
      );
    }, {} as any); // as SumSectionRelVarbs<SN, CRV & GeneralRelVarbs>;
    return omit(all, (toSkip ?? []) as ToSkip);
  },
};

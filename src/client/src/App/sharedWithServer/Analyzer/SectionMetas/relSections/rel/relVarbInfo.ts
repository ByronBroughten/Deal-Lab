import { Relative } from "../baseInfo";
import { BaseName, VarbName } from "../BaseName";
import { BaseNameSelector } from "../baseNameArrs";
import { baseVarbInfo, BaseVarbInfo, BaseVIOptions } from "../baseVarbInfo";

type SectionVarbSpecifier<
  SN extends BaseName<"hasVarb"> = BaseName<"hasVarb">,
  VN extends VarbName<SN> = VarbName<SN>,
  R extends Relative = Relative
> = [SN, VN, R];

type BaseRelVarbInfo<
  SN extends BaseName,
  VN extends VarbName<SN>,
  R extends Relative
> = BaseVarbInfo<
  "relId",
  { sectionName: SN; varbName: VN; id: R } & BaseVIOptions<"relId">
>;
export const relVarbInfo = {
  relative<
    SN extends BaseName<"hasVarb">,
    VN extends VarbName<SN>,
    R extends Relative
  >(sectionName: SN, varbName: VN, relative: R): BaseRelVarbInfo<SN, VN, R> {
    return {
      sectionName,
      varbName,
      id: relative,
      idType: "relId",
      context: "fe",
    } as BaseRelVarbInfo<SN, VN, R>;
  },
  relatives(namesAndSpecifiers: SectionVarbSpecifier[]) {
    return namesAndSpecifiers.map((namesAndSpec) =>
      this.relative(...namesAndSpec)
    );
  },
  specifiers<
    SN extends BaseName<"hasVarb">,
    VN extends VarbName<SN>,
    R extends Relative
  >(relative: R, namesArr: [SN, VN][]): BaseRelVarbInfo<SN, VN, R>[] {
    return namesArr.map((names) => {
      const props: [SN, VN, R] = [names[0], names[1], relative];
      return this.relative(...props);
    });
  },
  children<SN extends BaseName<"hasVarb">, VN extends VarbName<SN>>(
    sectionName: SN,
    varbName: VN
  ) {
    return this.relative(sectionName, varbName, "children");
  },
  local<SN extends BaseName<"hasVarb">, VN extends VarbName<SN>>(
    sectionName: SN,
    varbName: VN
  ): BaseRelVarbInfo<SN, VN, "local"> {
    return this.relative(sectionName, varbName, "local");
  },
  locals<SN extends BaseName<"hasVarb">, VN extends VarbName<SN>>(
    sectionName: SN,
    varbNames: VN[]
  ): BaseRelVarbInfo<SN, VN, "local">[] {
    return varbNames.map((varbName) => this.local(sectionName, varbName));
  },
  static<SN extends BaseName<"alwaysOneHasVarb">, VN extends VarbName<SN>>(
    sectionName: SN,
    varbName: VN
  ): BaseRelVarbInfo<SN, VN, "static"> {
    return this.relative(sectionName, varbName, "static");
  },
  statics<SN extends BaseName<"alwaysOneHasVarb">, VN extends VarbName<SN>>(
    names: [sectionName: SN, varbName: VN][]
  ): BaseRelVarbInfo<SN, VN, "static">[] {
    return names.map(([sectionName, varbName]) =>
      this.static(sectionName, varbName)
    );
  },
  // VarbName<SN & BaseNameSelector, BaseValueName, SC>
  localsByVarbName<
    SN extends BaseName,
    VNS extends VarbName<SN & BaseNameSelector>[],
    MP = {
      [Prop in VNS & string]: BaseVarbInfo<
        "relLocal",
        {
          sectionName: SN;
          varbName: Prop;
        } & BaseVIOptions<"relLocal">
      >;
    },
    Result = MP[keyof MP][]
  >(sectionName: SN, varbNames: VNS): Result {
    return varbNames.map((varbName) =>
      baseVarbInfo("relId", sectionName, varbName, "local")
    ) as any as Result;
  },
};

function _localsByVarbNameTest() {
  const _test = relVarbInfo.localsByVarbName("property", ["price", "title"]);
  const result = _test[0];
  // actually write this test.
  // It's an array of infos at least, so that's good.
}

import { BaseName } from "../../baseSectionsDerived/baseSectionTypes";
import {
  InRelVarbInfo,
  LocalRelVarbInfo,
  RelVarbInfo,
  RelVarbInfoStatic,
} from "../../baseSectionsDerived/baseVarbInfo";
import { Relative } from "../../baseSectionsUtils/relativeIdInfo";

type SectionVarbSpecifier = [BaseName<"hasVarb">, string, Relative];
type GenRelVarbInfo<
  S extends string,
  V extends string,
  T extends Relative
> = RelVarbInfo & {
  sectionName: S;
  varbName: V;
  id: T;
};

export const relVarbInfo = {
  relative<S extends BaseName<"hasVarb">, V extends string, R extends Relative>(
    sectionName: S,
    varbName: V,
    relative: R
  ): GenRelVarbInfo<S, V, R> {
    return {
      sectionName,
      varbName,
      id: relative,
      idType: "relative",
    } as GenRelVarbInfo<S, V, R>;
  },
  relatives(namesAndSpecifiers: SectionVarbSpecifier[]) {
    return namesAndSpecifiers.map((namesAndSpec) =>
      this.relative(...namesAndSpec)
    );
  },
  specifiers<
    S extends BaseName<"hasVarb">,
    V extends string,
    T extends Relative
  >(relative: T, namesArr: [S, V][]): GenRelVarbInfo<S, V, T>[] {
    return namesArr.map((names) => {
      const props: [S, V, T] = [names[0], names[1], relative];
      return this.relative(...props);
    });
  },
  children(sectionName: BaseName<"hasVarb">, varbName: string): InRelVarbInfo {
    return this.relative(sectionName, varbName, "children");
  },
  local(sectionName: BaseName<"hasVarb">, varbName: string): LocalRelVarbInfo {
    return this.relative(sectionName, varbName, "local");
  },
  locals(
    sectionName: BaseName<"hasVarb">,
    varbNames: string[]
  ): LocalRelVarbInfo[] {
    return varbNames.map((varbName) => this.local(sectionName, varbName));
  },
  static<S extends BaseName<"alwaysOneHasVarb">, V extends string>(
    sectionName: S,
    varbName: V
  ): GenRelVarbInfo<S, V, "static"> {
    return this.relative(sectionName, varbName, "static");
  },
  statics(
    names: [sectionName: BaseName<"alwaysOneHasVarb">, varbName: string][]
  ): RelVarbInfoStatic[] {
    return names.map(([sectionName, varbName]) =>
      this.static(sectionName, varbName)
    );
  },
  localsByVarbName(
    sectionName: BaseName<"hasVarb">,
    varbNames: string[]
  ): LocalRelVarbInfo[] {
    return varbNames.map(
      (varbName) =>
        ({
          sectionName,
          varbName,
          id: "local",
          idType: "relative",
        } as LocalRelVarbInfo)
    );
  },
};

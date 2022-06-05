import Analyzer from "../../../Analyzer";
import { sectionMetas } from "../../../SectionsMeta";
import { InEntityVarbInfo } from "../../../SectionsMeta/baseSections/baseValues/entities";
import { BaseName } from "../../../SectionsMeta/baseSectionTypes";
import { InfoS } from "../../../SectionsMeta/Info";
import { FeVarbInfo } from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ongoingVarbSpanEndings } from "../../../SectionsMeta/relSections/rel/relVarbs/preOngoingVarbs";
import { SectionName, sectionNameS } from "../../../SectionsMeta/SectionName";
import { Obj } from "../../../utils/Obj";

export type SectionOption = {
  dbId: string;
  displayName: string;
};
export type VariableOption = {
  varbInfo: InEntityVarbInfo;
  collectionName: string;
  displayName: string;
};

// options
function initStaticVarbOption(
  sectionName: SectionName<"hasGlobalVarbs">,
  varbName: string
): VariableOption {
  const varbMeta = sectionMetas.varb({
    sectionName,
    varbName,
  });
  const sectionMeta = sectionMetas.section(sectionName);

  return {
    varbInfo: {
      sectionName,
      varbName,
      id: "static",
      idType: "relative",
    },
    collectionName: sectionMeta.get("displayName"),
    displayName: varbMeta.displayName as string,
  };
}
function initStaticVarbOptions(): VariableOption[] {
  const sectionMetaEntries = Object.entries(sectionMetas.raw.fe);
  return sectionMetaEntries.reduce((options, [sectionName, sectionMeta]) => {
    const varbNames = Obj.keys(sectionMeta.varbMetas) as string[];
    if (sectionNameS.is(sectionName, "hasGlobalVarbs"))
      options = options.concat(
        varbNames
          .map((varbName) => initStaticVarbOption(sectionName, varbName))
          .filter((val) => val.displayName !== "")
      );
    return options;
  }, [] as VariableOption[]);
}

function userOption(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo<BaseName<"uniqueDbId">>,
  collectionName: string,
  displayName: string
): VariableOption {
  const section = analyzer.section(feVarbInfo);
  return {
    varbInfo: {
      ...feVarbInfo,
      id: section.dbId,
      idType: "dbId",
    },
    collectionName,
    displayName,
  };
}
function userVarbOption(
  analyzer: Analyzer,
  feId: string,
  collectionName: string
): VariableOption {
  const feVarbInfo = {
    sectionName: "userVarbItem",
    varbName: "value",
    id: feId,
    idType: "feId",
  } as const;
  const displayName = analyzer.feValue("name", feVarbInfo, "string");
  return userOption(analyzer, feVarbInfo, collectionName, displayName);
}
function userVarbOptions(analyzer: Analyzer): VariableOption[] {
  const section = analyzer.section("main");
  const varbListFeIds = section.childFeIds("userVarbList");

  const varbOptions = varbListFeIds.reduce((options, id) => {
    const listSection = analyzer.section({
      sectionName: "userVarbList",
      id,
      idType: "feId",
    });
    const collectionName = listSection.value("title", "string");
    const userVarbIds = listSection.childFeIds("userVarbItem");
    return options.concat(
      userVarbIds.map((id) => userVarbOption(analyzer, id, collectionName))
    );
  }, [] as VariableOption[]);
  return varbOptions;
}

function userListTotalOptions(analyzer: Analyzer): VariableOption[] {
  const sectionToCollectionName: Record<SectionName<"additiveList">, string> = {
    userOngoingList: "Ongoing cost totals",
    userSingleList: "One time cost totals",
  };

  const options: VariableOption[] = [];

  for (const sectionName of sectionNameS.arrs.additiveList) {
    const collectionName = sectionToCollectionName[sectionName];
    const feIds = analyzer.singleSection("main").childFeIds(sectionName);
    for (const id of feIds) {
      const feInfo = {
        sectionName,
        id,
        idType: "feId",
      } as const;

      const title = analyzer.feValue("title", feInfo, "string");
      let varbNameBase = "total";

      if (sectionName === "userOngoingList") {
        for (const ending of Object.values(ongoingVarbSpanEndings)) {
          const varbName = varbNameBase + ending;
          options.push(
            userOption(analyzer, { ...feInfo, varbName }, collectionName, title)
          );
        }
      } else {
        options.push(
          userOption(
            analyzer,
            InfoS.feVarb(varbNameBase, feInfo),
            collectionName,
            title
          )
        );
      }
    }
  }
  return options;
}

export function variableOptions(this: Analyzer): VariableOption[] {
  return [
    ...initStaticVarbOptions(),
    ...userVarbOptions(this),
    ...userListTotalOptions(this),
  ];
}
// how do I want to handle these?
// I can put them on SolverSections

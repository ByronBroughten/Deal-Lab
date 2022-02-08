import Analyzer from "../../Analyzer";
import { ObjectEntries, ObjectKeys } from "../../utils/Obj";
import { sectionMetas } from "../SectionMetas";
import {
  InEntities,
  InEntity,
  InEntityVarbInfo,
} from "../SectionMetas/relSections/rel/valueMeta/NumObj/entities";
import {
  DbVarbInfo,
  FeVarbInfo,
  SpecificVarbInfo,
  StaticRelVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ongoingVarbSpanEndings } from "../SectionMetas/relSections/rel/relVarbs/preOngoingVarbs";
import { Inf } from "../SectionMetas/Info";
import { SectionNam, SectionName } from "../SectionMetas/SectionName";

export type SectionOption = {
  dbId: string;
  displayName: string;
};
export type VariableOption = {
  varbInfo: InEntityVarbInfo;
  collectionName: string;
  displayName: string;
};

type StaticVariableList = {
  sectionName: SectionName<"alwaysOne">;
  staticVarbInfos: StaticRelVarbInfo[];
};

function initStaticVarbInfos(
  sectionName: SectionName<"hasGlobalVarbs">,
  varbNames: string[]
): StaticRelVarbInfo[] {
  return varbNames.reduce((staticInfos, varbName) => {
    return staticInfos.concat({
      sectionName,
      varbName,
      id: "static",
      idType: "relative",
    });
  }, [] as StaticRelVarbInfo[]);
}
function initStaticVariableLists(): StaticVariableList[] {
  const sectionMetaEntries = ObjectEntries(sectionMetas.raw);
  return sectionMetaEntries.reduce(
    (variableLists, [sectionName, sectionMeta]) => {
      const { varbMetas } = sectionMeta;
      const varbNames = ObjectKeys(varbMetas) as string[];
      if (
        SectionNam.is(sectionName, "hasGlobalVarbs") &&
        varbNames.length > 0
      ) {
        variableLists.push({
          sectionName,
          staticVarbInfos: initStaticVarbInfos(sectionName, varbNames),
        });
      }
      return variableLists;
    },
    [] as StaticVariableList[]
  );
}
export const staticVariableLists = initStaticVariableLists();

function entityInEntities(entities: InEntities, entity: InEntity): boolean {
  const match = entities.find((e) => (e.entityId = entity.entityId));
  if (match) return true;
  else return false;
}
export function updateConnectedEntities(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextEntities: InEntities
): Analyzer {
  let next = this;

  const entities = next.varb(feVarbInfo).inEntities;
  const missingEntities = entities.filter(
    (entity) => !entityInEntities(nextEntities, entity)
  );
  const newEntities = nextEntities.filter(
    (entity) => !entityInEntities(entities, entity)
  );
  for (const entity of missingEntities) {
    if (this.hasSection(entity)) {
      next = next.removeInEntity(feVarbInfo, entity);
    }
  }

  for (const entity of newEntities) {
    next = next.addInEntity(feVarbInfo, entity);
  }
  return next;
}

export function userVariableInfos(this: Analyzer): DbVarbInfo[] {
  return this.userVariableLists().reduce((userVarbInfos, userVarbList) => {
    return userVarbInfos.concat(userVarbList.userVarbInfos);
  }, [] as DbVarbInfo[]);
}
type UserVariableList = {
  dbId: string;
  userVarbInfos: DbVarbInfo[];
};
export function userVariableLists(this: Analyzer): UserVariableList[] {
  const varbListIds = this.singleSection("main").childFeIds("userVarbList");
  const uvLists = varbListIds.reduce((uvLists, id) => {
    const listSection = this.section({
      sectionName: "userVarbList",
      id,
      idType: "feId",
    });
    uvLists.push({
      dbId: listSection.dbId,
      userVarbInfos: listSection.childFeIds("userVarbItem").map((varbId) => ({
        sectionName: "userVarbItem",
        varbName: "value",
        id: varbId,
        idType: "dbId",
      })),
    });
    return uvLists;
  }, [] as UserVariableList[]);
  return uvLists;
}
type VariableLists = {
  static: StaticVariableList[];
  user: UserVariableList[];
};
export function variableLists(this: Analyzer): VariableLists {
  return {
    static: staticVariableLists,
    user: this.userVariableLists(),
  };
}

// options
function initStaticVarbOption(
  sectionName: SectionName<"hasGlobalVarbs">,
  varbName: string
): VariableOption {
  const varbMeta = sectionMetas.varbMeta({ sectionName, varbName });
  const sectionMeta = sectionMetas.get(sectionName);
  return {
    varbInfo: {
      sectionName,
      varbName,
      id: "static",
      idType: "relative",
    },
    collectionName: sectionMeta.displayName,
    displayName: varbMeta.displayName as string,
  };
}
function initStaticVarbOptions(): VariableOption[] {
  const sectionMetaEntries = Object.entries(sectionMetas.raw);
  return sectionMetaEntries.reduce((options, [sectionName, sectionMeta]) => {
    const varbNames = ObjectKeys(sectionMeta.varbMetas) as string[];
    if (SectionNam.is(sectionName, "hasGlobalVarbs"))
      options = options.concat(
        varbNames.map((varbName) => initStaticVarbOption(sectionName, varbName))
      );
    return options;
  }, [] as VariableOption[]);
}
const staticVarbOptions = initStaticVarbOptions();

export function userOption(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  collectionName: string,
  displayName: string
): VariableOption {
  const section = this.section(feVarbInfo);
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
export function userVarbOption(
  this: Analyzer,
  feId: string,
  collectionName: string
): VariableOption {
  const feVarbInfo = {
    sectionName: "userVarbItem",
    varbName: "value",
    id: feId,
    idType: "feId",
  } as const;
  const displayName = this.feValue("name", feVarbInfo, "string");
  return this.userOption(feVarbInfo, collectionName, displayName);
}
export function userVarbOptions(this: Analyzer): VariableOption[] {
  const varbListFeIds = this.childFeIds(["main", "userVarbList"]);
  const varbOptions = varbListFeIds.reduce((options, id) => {
    const listSection = this.section({
      sectionName: "userVarbList",
      id,
      idType: "feId",
    });
    const collectionName = listSection.value("title", "string");
    const userVarbIds = listSection.childFeIds("userVarbItem");
    return options.concat(
      userVarbIds.map((id) => this.userVarbOption(id, collectionName))
    );
  }, [] as VariableOption[]);
  return varbOptions;
}

const sectionToCollectionName: Record<
  SectionName<"additiveListType">,
  string
> = {
  userOngoingList: "Ongoing cost totals",
  userSingleList: "One time cost totals",
};
export function userListTotalOptions(this: Analyzer): VariableOption[] {
  const options: VariableOption[] = [];
  for (const sectionName of SectionNam.arr.additiveListType) {
    const collectionName = sectionToCollectionName[sectionName];
    const feIds = this.singleSection("main").childFeIds(sectionName);
    for (const id of feIds) {
      const feInfo = {
        sectionName,
        id,
        idType: "feId",
      } as const;

      const title = this.feValue("title", feInfo, "string");
      let varbNameBase = "total";

      if (sectionName === "userOngoingList") {
        for (const ending of Object.values(ongoingVarbSpanEndings)) {
          const varbName = varbNameBase + ending;
          options.push(
            this.userOption({ ...feInfo, varbName }, collectionName, title)
          );
        }
      } else {
        options.push(
          this.userOption(
            Inf.feVarb(varbNameBase, feInfo),
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
    ...staticVarbOptions,
    ...this.userVarbOptions(),
    ...this.userListTotalOptions(),
  ];
}

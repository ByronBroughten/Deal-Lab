import { sectionsMeta } from "../SectionsMeta";
import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { switchNames } from "../SectionsMeta/baseSectionsUtils/RelSwitchVarb";
import { mixedInfoS } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { Obj } from "../utils/Obj";

export type SectionOption = {
  dbId: string;
  displayName: string;
};
export type VariableOption = {
  varbInfo: InEntityVarbInfo;
  collectionName: string;
  displayName: string;
};

export class VariableGetterSections extends GetterSectionsBase {
  getterSections = new GetterSections(this.getterSectionsProps);
  variableOptions(): VariableOption[] {
    return [
      ...this.initGlobalVarbOptions(),
      ...this.userVarbOptions(),
      ...this.userListTotalOptions(),
    ];
  }
  private userVarbOptions(): VariableOption[] {
    const { main } = this.getterSections;
    const feUser = main.onlyChild("feUser");
    const childName = "userVarbListMain";
    const varbListFeIds = feUser.childFeIds(childName);
    return varbListFeIds.reduce((options, feId) => {
      const listSection = feUser.child({ childName, feId });
      const userVarbItems = listSection.children("userVarbItem");
      const collectionName = listSection.value("displayName", "string");
      return options.concat(
        userVarbItems.map((item) => {
          return {
            displayName: item.virtualVarb.displayName,
            collectionName,
            varbInfo: {
              ...item.dbInfoMixed("onlyOne"),
              varbName: "value",
            },
          };
        })
      );
    }, [] as VariableOption[]);
  }

  private userListTotalOptions(): VariableOption[] {
    const totalNames: Record<SectionName<"additiveList">, any> = {
      ongoingList: {
        collectionName: "Ongoing cost totals",
        feUserStoreName: "ongoingListMain",
      },
      singleTimeList: {
        collectionName: "One time cost totals",
        feUserStoreName: "singleTimeListMain",
      },
    };
    const options: VariableOption[] = [];
    for (const sectionName of Obj.keys(totalNames)) {
      const names = totalNames[sectionName];
      const { collectionName, feUserStoreName } = names;
      const { main } = this.getterSections;
      const feUser = main.onlyChild("feUser");
      const lists = feUser.children(feUserStoreName);
      for (const list of lists) {
        const displayName = list.value("displayName", "string");
        if (sectionName === "ongoingList") {
          const ongoingNames = switchNames("total", "ongoing");
          for (const key of Obj.keys(ongoingNames)) {
            if (key === "switch") continue;
            const varbName = ongoingNames[key];
            const varb = list.varb(varbName);
            options.push({
              varbInfo: varb.dbVarbInfoMixed("onlyOne"),
              displayName,
              collectionName,
            });
          }
        } else {
          const varb = list.varb("total");
          options.push({
            varbInfo: varb.dbVarbInfoMixed("onlyOne"),
            displayName,
            collectionName,
          });
        }
      }
    }
    return options;
  }
  private initGlobalVarbOptions(): VariableOption[] {
    const sectionNames = sectionNameS.arrs.all;
    return sectionNames.reduce((options, sectionName) => {
      const sectionMeta = sectionsMeta.section(sectionName);
      const { varbNames } = sectionMeta;
      if (sectionNameS.is(sectionName, "hasGlobalVarbs")) {
        const moreOptions = varbNames
          .map((varbName) => this.sectionsMeta.varb({ sectionName, varbName }))
          .filter((varbMeta) => varbMeta.valueName === "numObj")
          .map((varbMeta) => this.initGlobalVarbOption(varbMeta.varbNameInfo));

        options = options.concat(moreOptions);
      }
      return options;
    }, [] as VariableOption[]);
  }
  private initGlobalVarbOption({
    sectionName,
    varbName,
  }: InitGlobalVarbOptionProps): VariableOption {
    const section = this.getterSections.oneAndOnly(sectionName);
    const varb = section.varb(varbName);
    return {
      varbInfo: {
        ...mixedInfoS.makeGlobalSection(sectionName),
        varbName,
      },
      collectionName: section.meta.displayName,
      displayName: varb.displayNameFull,
    };
  }
}
type InitGlobalVarbOptionProps = {
  sectionName: SectionName<"hasGlobalVarbs">;
  varbName: string;
};

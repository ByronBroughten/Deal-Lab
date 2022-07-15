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
    const childName = "userVarbList";
    const varbListFeIds = main.childFeIds("userVarbList");
    return varbListFeIds.reduce((options, feId) => {
      const listSection = main.child({ childName, feId });
      const userVarbItems = listSection.children("userVarbItem");
      const collectionName = listSection.value("title", "string");
      return options.concat(
        userVarbItems.map((item) => {
          return {
            displayName: item.varb("displayName").value("string"),
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
    const sectionToCollectionName: Record<
      SectionName<"additiveList">,
      string
    > = {
      ongoingList: "Ongoing cost totals",
      singleTimeList: "One time cost totals",
    };
    const options: VariableOption[] = [];
    for (const sectionName of sectionNameS.arrs.additiveList) {
      const collectionName = sectionToCollectionName[sectionName];
      const { main } = this.getterSections;
      const lists = main.children(sectionName);
      for (const list of lists) {
        const displayName = list.value("title", "string");
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
          .map((varbMeta) =>
            this.initGlobalVarbOption(varbMeta.sectionVarbNames)
          );

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
      displayName: varb.fullDisplayName,
    };
  }
}
type InitGlobalVarbOptionProps = {
  sectionName: SectionName<"hasGlobalVarbs">;
  varbName: string;
};

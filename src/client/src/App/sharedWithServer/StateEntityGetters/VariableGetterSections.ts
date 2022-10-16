import { sectionsMeta } from "../SectionsMeta";
import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { switchNames } from "../SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import { childPaths } from "../SectionsMeta/childSections";
import { mixedInfoS } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import {
  SectionNameByType,
  sectionNameS,
} from "../SectionsMeta/SectionNameByType";
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
    // Ok. This is only for userVarbs, is that right?
    //
    const { main } = this.getterSections;
    const feUser = main.onlyChild("feUser");
    const childName = "userVarbListMain";
    const varbListFeIds = feUser.childFeIds(childName);
    return varbListFeIds.reduce((options, feId) => {
      const listSection = feUser.child({ childName, feId });
      const userVarbItems = listSection.children("userVarbItem");
      const collectionName = listSection.valueNext("displayName").mainText;
      return options.concat(
        userVarbItems.map((item) => {
          const varbInfo = {
            ...mixedInfoS.absoluteDbIdPath(
              "userVarbItem",
              childPaths.userVarbItem,
              item.dbId,
              "onlyOne"
            ),
            varbName: "value",
          };
          return {
            displayName: item.virtualVarb.displayName,
            collectionName,
            varbInfo,
          };
        })
      );
    }, [] as VariableOption[]);
  }

  private userListTotalOptions(): VariableOption[] {
    const totalNames: Record<SectionNameByType<"additiveList">, any> = {
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
        const displayName = list.valueNext("displayName").mainText;
        if (sectionName === "ongoingList") {
          const ongoingNames = switchNames("total", "ongoing");
          for (const key of Obj.keys(ongoingNames)) {
            if (key === "switch") continue;
            const varbName = ongoingNames[key];
            const varb = list.varb(varbName);
            const varbInfo = {
              ...mixedInfoS.absoluteDbIdPath(
                "ongoingItem",
                childPaths.ongoingItemMain,
                varb.dbId,
                "onlyOne"
              ),
              varbName: varb.varbName,
            };
            options.push({
              varbInfo,
              displayName,
              collectionName,
            });
          }
        } else {
          const varb = list.varb("total");
          const varbInfo = {
            ...mixedInfoS.absoluteDbIdPath(
              "singleTimeItem",
              childPaths.singleTimeItemMain,
              varb.dbId,
              "onlyOne"
            ),
            varbName: varb.varbName,
          };
          options.push({
            varbInfo,
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
      if (sectionNameS.is(sectionName, "hasGlobalVarbs")) {
        options = options.concat(this.initSectionOptions(sectionName));
      }
      return options;
    }, [] as VariableOption[]);
  }
  initSectionOptions(sectionName: SectionNameByType<"hasGlobalVarbs">) {
    const sectionMeta = sectionsMeta.section(sectionName);
    const { varbNames } = sectionMeta;
    const varbMetas = varbNames.map((varbName) =>
      this.sectionsMeta.varb({ sectionName, varbName })
    );
    const numObjMetas = varbMetas.filter(
      (varbMeta) => varbMeta.valueName === "numObj"
    );
    return numObjMetas.map((varbMeta) =>
      this.initAbsoluteVarbOption(varbMeta.varbNameInfo)
    );
  }
  private initAbsoluteVarbOption({
    sectionName,
    varbName,
  }: InitGlobalVarbOptionProps): VariableOption {
    const path = [
      ...childPaths.activeDeal,
      ...this.absoluteOptionPaths[sectionName],
    ];
    const section = this.getterSections.oneAndOnly(sectionName);
    const varb = section.varb(varbName);
    return {
      varbInfo: mixedInfoS.absoluteVarbPath(
        sectionName,
        path,
        varbName,
        "onlyOne"
      ),
      collectionName: section.meta.displayName,
      displayName: varb.displayNameFull,
    };
  }
  private get absoluteOptionPaths() {
    return {
      propertyGeneral: ["propertyGeneral"],
      financing: ["financing"],
      mgmtGeneral: ["mgmtGeneral"],
      deal: [],
    } as const;
  }
}
type InitGlobalVarbOptionProps = {
  sectionName: SectionNameByType<"hasGlobalVarbs">;
  varbName: string;
};

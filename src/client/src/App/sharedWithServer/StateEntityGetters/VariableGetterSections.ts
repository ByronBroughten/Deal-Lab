import { switchKeyToVarbNames } from "../SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import { EditorVarbInfo } from "../SectionsMeta/allBaseSectionVarbs/baseValues/entities";
import { mixedInfoS } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import {
  GetterSectionsBase,
  GetterSectionsRequiredProps,
} from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { Obj } from "../utils/Obj";
import { VarbName } from "./../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { PathDbVarbInfoMixed } from "./../SectionsMeta/SectionInfo/PathNameInfo";
import { absoluteVarbOptions } from "./pathVarbOptions";

export type SectionOption = {
  dbId: string;
  displayName: string;
};
export type VariableOption = {
  varbInfo: EditorVarbInfo;
  collectionName: string;
  displayName: string;
};

export class VariableGetterSections extends GetterSectionsBase {
  static init(props: GetterSectionsRequiredProps) {
    return new VariableGetterSections(GetterSectionsBase.initProps(props));
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  variableOptions(): VariableOption[] {
    return [
      ...absoluteVarbOptions,
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
      const collectionName = listSection.valueNext("displayName").mainText;
      return options.concat(
        userVarbItems.map((item) => {
          return {
            displayName: item.virtualVarb.displayName,
            collectionName,
            varbInfo: {
              ...mixedInfoS.pathNameDbId("userVarbItemMain", item.dbId),
              varbName: "value",
            },
          };
        })
      );
    }, [] as VariableOption[]);
  }

  private userListTotalOptions(): VariableOption[] {
    const totalNames = {
      ongoingList: {
        collectionName: "Ongoing cost totals",
        feUserStoreName: "ongoingListMain",
      },
      singleTimeList: {
        collectionName: "One time cost totals",
        feUserStoreName: "singleTimeListMain",
      },
    } as const;
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
          const ongoingNames = switchKeyToVarbNames("total", "ongoing");
          for (const key of Obj.keys(ongoingNames)) {
            if (key === "switch") continue;
            const varbName = ongoingNames[key];
            const varb = list.varb(varbName);
            const varbInfo = {
              ...mixedInfoS.pathNameDbId("ongoingItemMain", varb.dbId),
              varbName: varb.varbName as VarbName,
            };
            options.push({
              varbInfo,
              displayName,
              collectionName,
            });
          }
        } else {
          const varb = list.varb("total");
          const varbInfo: PathDbVarbInfoMixed = {
            ...mixedInfoS.pathNameDbId("singleTimeItemMain", varb.dbId),
            varbName: varb.varbName as VarbName,
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
}

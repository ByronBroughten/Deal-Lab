import {
  GetterSectionsBase,
  GetterSectionsRequiredProps,
} from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { varbPathOptions, VariableOption } from "./varbPathOptions";

export type SectionOption = {
  dbId: string;
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
    return [...varbPathOptions, ...this.userVarbOptions()];
  }
  private userVarbOptions(): VariableOption[] {
    const { main } = this.getterSections;
    const feStore = main.onlyChild("feStore");
    const childName = "numVarbListMain";
    const varbListFeIds = feStore.childFeIds(childName);
    return varbListFeIds.reduce((options, feId) => {
      const listSection = feStore.child({ childName, feId });
      const userVarbItems = listSection.children("numVarbItem");
      const collectionName = listSection.valueNext("displayName").mainText;
      return options.concat(
        userVarbItems.map((item) => {
          return {
            displayName: item.virtualVarb.displayName,
            collectionName,
            varbInfo: {
              infoType: "varbPathDbId",
              varbPathName: "userVarbValue",
              dbId: item.dbId,
            },
          };
        })
      );
    }, [] as VariableOption[]);
  }
}

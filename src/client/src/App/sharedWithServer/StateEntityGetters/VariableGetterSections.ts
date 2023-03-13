import { ValueInEntityInfo } from "../SectionsMeta/values/StateValue/valuesShared/entities";
import {
  GetterSectionsBase,
  GetterSectionsRequiredProps,
} from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { varbPathOptions } from "./pathNameOptions";

export type SectionOption = {
  dbId: string;
  displayName: string;
};
export type VariableOption = {
  varbInfo: ValueInEntityInfo;
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
    return [...varbPathOptions, ...this.userVarbOptions()];
  }
  private userVarbOptions(): VariableOption[] {
    const { main } = this.getterSections;
    const feUser = main.onlyChild("feUser");
    const childName = "numVarbListMain";
    const varbListFeIds = feUser.childFeIds(childName);
    return varbListFeIds.reduce((options, feId) => {
      const listSection = feUser.child({ childName, feId });
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

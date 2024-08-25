import { GetterSectionsBase } from "../../StateGetters/Bases/GetterSectionsBase";
import { InEntityGetterSections } from "../../StateGetters/InEntityGetterSections";
import { EntityPrepperVarb } from "./EntityPrepperVarb";

export class EntityPrepperSections extends GetterSectionsBase {
  private get inEntitySections() {
    return new InEntityGetterSections(this.getterSectionsProps);
  }
  addAppWideMissingOutEntities(): void {
    const { appWideVarbInfosWithInEntities } = this.inEntitySections;
    for (const feVarbInfo of appWideVarbInfosWithInEntities) {
      const prepperVarb = new EntityPrepperVarb({
        ...this.getterSectionsProps,
        ...feVarbInfo,
      });

      prepperVarb.addOutEntitiesFromAllInEntities();
    }
  }
}

import {
  OutEntity,
  OutEntityInfo,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../StateGetters/InEntityGetterVarb";
import { Arr } from "../utils/Arr";

export class OutEntityGetterVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbProps);
  }
  get activeOutVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.activeOutEntities);
  }
  get outEntities(): OutEntity[] {
    return this.get.raw.outEntities;
  }
  hasOutEntity(info: OutEntityInfo): boolean {
    return Arr.has(this.outEntities, (e) => this.isInfoForOutEntity(e, info));
  }
  outEntitiesWithout(info: OutEntityInfo): OutEntity[] {
    return this.outEntities.filter((e) => !this.isInfoForOutEntity(e, info));
  }
  private isInfoForOutEntity(
    outEntity: OutEntity,
    info: OutEntityInfo
  ): boolean {
    return (
      outEntity.entityId === info.entityId && // differentiates multiple from the same varb
      outEntity.feId === info.feId && // differentiates inEntites between sections
      outEntity.varbName === info.varbName // differentiates local inEntities
    );
  }
  get activeOutEntities(): OutEntity[] {
    return this.outEntities.filter((outEntity) => {
      const varb = new InEntityGetterVarb({
        ...outEntity,
        ...this.getterSectionsProps,
      });
      return varb.isActiveInEntity(outEntity.entityId);
    });
  }
}

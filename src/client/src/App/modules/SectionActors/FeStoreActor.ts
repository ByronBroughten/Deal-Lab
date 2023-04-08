import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { FeChildInfo } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { DbSectionName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  StoreName,
  storeNames,
} from "../../sharedWithServer/SectionsMeta/sectionStores";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterSections } from "../../sharedWithServer/StateSetters/SetterSections";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { GetterFeStore } from "../FeStore/GetterFeStore";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
import { UserInfoTokenProp, userTokenS } from "../services/userTokenS";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

export type FeUserActorProps = StrictOmit<
  SectionActorBaseProps<"feStore">,
  "sectionName"
>;

export class FeStoreActor extends SectionActorBase<"feStore"> {
  constructor(props: FeUserActorProps) {
    super({
      ...props,
      sectionName: "feStore",
    });
  }
  async saveAllSections(): Promise<any> {
    const sectionPackArrs = this.packMaker.makeChildPackArrs(storeNames);
    return this.apiQueries.replaceSectionArrs(makeReq({ sectionPackArrs }));
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.sectionActorBaseProps);
  }
  get setterSections(): SetterSections {
    return new SetterSections(this.sectionActorBaseProps);
  }
  get getter(): GetterFeStore {
    return new GetterFeStore(this.getterSections.getterSectionsProps);
  }
  get setter(): SetterSection<"feStore"> {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker(): PackMakerSection<"feStore"> {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  private querier<CN extends StoreName>(storeName: CN): SectionQuerier<CN> {
    return new SectionQuerier({
      apiQueries: this.apiQueries,
      dbStoreName: storeName,
    });
  }
  initialSaveSection<CN extends StoreName>(
    childInfo: FeChildInfo<"feStore", CN>
  ) {
    const child = this.get.child(childInfo);
    const childPack = child.packMaker.makeSectionPack();

    const querier = this.querier(childInfo.childName);
    let headers: UserInfoTokenProp | null = null;
    this.setter.tryAndRevertIfFail(async () => {
      const res = await querier.add(
        childPack as SectionPack<DbSectionName<CN>>
      );
      headers = res.headers;
    });
    if (headers) userTokenS.setTokenFromHeaders(headers);
  }
  async updateSubscriptionData() {
    const { headers, data } = await this.apiQueries.getSubscriptionData(
      makeReq({})
    );
    userTokenS.setTokenFromHeaders(headers);
    this.setter.updateValues({
      labSubscription: data.labSubscription,
      labSubscriptionExp: data.labSubscriptionExp,
    });
  }
  get labSubscription(): StateValue<"labSubscription"> {
    return this.get.valueNext("labSubscription");
  }
  get isLoggedIn(): boolean {
    return this.getter.isLoggedIn;
  }
  get isGuest(): boolean {
    return this.getter.isGuest;
  }
}

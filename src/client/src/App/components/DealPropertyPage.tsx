import {
  CompletionStatus,
  DealMode,
} from "../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import { DealProperty } from "./ActiveDealPage/ActiveDeal/PropertyGeneral/DealProperty";
import { OuterMainSection } from "./appWide/GeneralSection/OuterMainSection";
import { NavContainerPage } from "./general/NavContainerPage";

export function DealPropertyPage() {
  const dealPage = useGetterSectionOnlyOne("dealPage");
  const varbs = dealPage.onlyChild("calculatedVarbs");
  const deal = dealPage.onlyChild("deal");
  return (
    <NavContainerPage activeBtnName="deal">
      <SectionPathContext.Provider value="userListEditorPage">
        <OuterMainSection>
          <DealProperty
            {...{
              completionStatus: varbs.valueNext(
                "propertyCompletionStatus"
              ) as CompletionStatus,
              dealMode: deal.valueNext("dealMode") as DealMode,
              feId: deal.onlyChildFeId("property"),
            }}
          />
        </OuterMainSection>
      </SectionPathContext.Provider>
    </NavContainerPage>
  );
}

import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { FormSection } from "../appWide/FormSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { SectionTitle } from "../appWide/SectionTitle";
import { VarbListUserVarbs } from "../appWide/VarbLists/VarbListUserVarbs";
import { Row } from "../general/Row";

export function UserVarbEditor() {
  const feStore = useSetterSectionOnlyOne("feStore");
  return (
    <SubSectionOpen>
      <Row
        style={{
          alignItems: "flex-start",
          flexWrap: "wrap",
          paddingBottom: nativeTheme.s3,
        }}
      >
        <SectionTitle
          sx={{ marginRight: nativeTheme.s4 }}
          text={
            <LabelWithInfo
              {...{
                label: "Variables",
                infoTitle: "Variables",
                infoText: `This page lets you define values that can then be plugged in all throughout the app.\n\nFor example, you might define a variable for a common cost, like the cost to replace an oven in your area. Then any time a property you're analyzing has a busted oven, you'll have that variable to enter as a repair cost and not have to go, "hmmm, how much does it cost to replace an oven, again?"\n\nAnd then if the cost of ovens changes—maybe you find a vendor with lower prices—simply update the variable, and then any inputs that contain that variable will update automatically, for any deal that you load up.`,
              }}
            />
          }
        />
      </Row>
      <FormSection>
        <MainSectionBody>
          <ListGroupLists
            {...{
              feIds: feStore.childFeIds("numVarbListMain"),
              addList: () => feStore.addChild("numVarbListMain"),
              makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
            }}
          />
        </MainSectionBody>
      </FormSection>
    </SubSectionOpen>
  );
}

import { StoreId } from "../../../sharedWithServer/Ids/StoreId";
import { useActionWithProps } from "../../stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../stateClassHooks/useIdOfSectionToSave";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { FormSection } from "../appWide/FormSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { PageTitle } from "../appWide/PageTitle";
import { VarbListUserVarbs } from "../appWide/VarbLists/VarbListUserVarbs";
import { Row } from "../general/Row";

export function UserVarbEditor() {
  const feStore = useGetterSectionOnlyOne("feStore");
  const addListNumVarbList = useActionWithProps("addToStore", {
    storeName: "numVarbListMain",
  });
  return (
    <SubSectionOpen>
      <Row
        style={{
          alignItems: "flex-start",
          flexWrap: "wrap",
          paddingBottom: nativeTheme.s3,
        }}
      >
        <PageTitle
          sx={{ marginRight: nativeTheme.s4 }}
          text={
            <LabelWithInfo
              {...{
                iconProps: { size: nativeTheme.pageInfoDotSize },
                label: "Your Variables",
                infoProps: {
                  title: "Your Variables",
                  info: `This page lets you define variables you can then plug in all throughout the app.\n\nFor example, you might define a variable for something like the cost to replace an oven in your area. Then, any time a property you're analyzing needs a new oven, you can plug that variable into a repair cost item and not have to go, "hmmm, how much does it cost to replace an oven, again?"\n\nThen if the cost of ovens changes—maybe you find a vendor with lower prices—simply update the variable and all inputs that reference it will update automatically, throughout all your deals.`,
                },
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
              addList: addListNumVarbList,
              makeListNode: (nodeProps) => (
                <IdOfSectionToSaveProvider
                  storeId={StoreId.make("numVarbListMain", nodeProps.feId)}
                >
                  <VarbListUserVarbs {...nodeProps} />,
                </IdOfSectionToSaveProvider>
              ),
            }}
          />
        </MainSectionBody>
      </FormSection>
    </SubSectionOpen>
  );
}

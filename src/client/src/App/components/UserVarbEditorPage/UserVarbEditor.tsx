import styled from "styled-components";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { FormSection } from "../appWide/FormSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListUserVarbs } from "../appWide/VarbLists/VarbListUserVarbs";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

export function UserVarbEditor() {
  const userVarbEditor = useSetterSectionOnlyOne("userVarbEditor");
  return (
    <Styled className="UserListMainSection-root">
      <UserEditorTitleRow
        {...{
          titleText: (
            <LabelWithInfo
              {...{
                label: "Variables",
                infoTitle: "Variables",
                infoText: `This page lets you define values that can then be plugged in all throughout the app.\n\nFor example, you might define a variable for a common cost, like the cost to replace an oven in your area. Then any time a property you're analyzing has a busted oven, you'll have that variable to enter as a repair cost and not have to go, "hmmm, how much does it cost to replace an oven, again?"\n\nAnd then if the cost of ovens changes—maybe you find a vendor with lower prices—simply update the variable, and then any inputs that contain that variable will update automatically, for any deal that you load up.`,
              }}
            />
          ),
          sectionName: "userVarbEditor",
          childNames: ["userVarbListMain"],
        }}
      />
      <FormSection>
        <MainSectionBody>
          <ListGroupLists
            {...{
              feIds: userVarbEditor.childFeIds("userVarbListMain"),
              addList: () => userVarbEditor.addChild("userVarbListMain"),
              makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
            }}
          />
        </MainSectionBody>
      </FormSection>
    </Styled>
  );
}

const Styled = styled(OuterMainSection)``;

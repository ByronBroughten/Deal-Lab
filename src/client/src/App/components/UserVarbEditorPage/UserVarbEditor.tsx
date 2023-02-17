import styled from "styled-components";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
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
                infoText: `The Variables page lets you define values in one place that can then be plugged in all throughout each of your deals.\n\nFor example, you might define a variable for a common cost—the cost of an oven, let's say. Then any time a property you're analyzing has a busted oven oven, you can just enter that variable as a repair cost and not have to go, "hmmm, how much does it cost to replace an oven, again?"\n\nAnd then if the cost of ovens changes—maybe you find a vendor with lower prices—simply update your oven cost variable, and then any deal you load up will automatically update its related values.`,
              }}
            />
          ),
          sectionName: "userVarbEditor",
          childNames: ["userVarbListMain"],
        }}
      />
      <MainSectionBody>
        <ListGroupLists
          {...{
            feIds: userVarbEditor.childFeIds("userVarbListMain"),
            addList: () => userVarbEditor.addChild("userVarbListMain"),
            makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(OuterMainSection)``;

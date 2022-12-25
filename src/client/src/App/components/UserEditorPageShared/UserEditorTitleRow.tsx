import { AiOutlineSave } from "react-icons/ai";
import { VscDiscard } from "react-icons/vsc";
import styled from "styled-components";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { InfoBlurb } from "../appWide/infoBlurb";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import theme from "./../../theme/Theme";

type Props = {
  saveChanges: () => void;
  discardChanges: () => void;
  areSaved: boolean;
  titleText: string;
};
export function UserEditorTitleRow({
  saveChanges,
  discardChanges,
  areSaved,
  titleText,
}: Props) {
  const authStatus = useAuthStatus();
  return (
    <Styled className="UserEditorTitleRow-root">
      <SectionTitleRow
        sectionTitle={titleText}
        className="UserListMainSection-sectionTitle"
        leftSide={
          <div className="UserListMainSection-btnsRow">
            <ListMenuBtn
              {...{
                text: "Save and Apply Changes",
                onClick: saveChanges,
                icon: <AiOutlineSave size="25" />,
                disabled: authStatus === "guest" || areSaved,
                className: "UserListMainSection-saveBtn",
              }}
            />
            <ListMenuBtn
              text="Discard Changes"
              onClick={discardChanges}
              icon={<VscDiscard />}
              disabled={areSaved}
              className="UserListMainSection-discardChanges"
            />
          </div>
        }
      />
      {authStatus === "guest" && (
        <InfoBlurb className="UserListMainSection-infoBlurb">
          Log in to save and apply changes.
        </InfoBlurb>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  .UserListMainSection-infoBlurb {
    margin-top: ${theme.s3};
  }
  .UserListMainSection-btnsRow {
    display: flex;
    align-items: center;
    .ListMenuBtn-root {
      height: 33px;
      margin: 0 ${theme.s2};
    }
  }
  .UserListMainSection-discardChanges {
    width: 150px;
  }
  .UserListMainSection-saveBtn {
    width: 250px;
  }
  .SectionTitle-root {
    margin-left: ${theme.s3};
  }
`;

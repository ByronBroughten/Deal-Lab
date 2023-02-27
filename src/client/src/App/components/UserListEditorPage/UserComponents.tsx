import styled from "styled-components";
import { Arr } from "../../sharedWithServer/utils/Arr";
import theme from "../../theme/Theme";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { SectionTitle } from "../appWide/SectionTitle";
import { UserComponentClosed, userComponentNames } from "./UserComponentClosed";

const orderedNames = Arr.extractOrder(userComponentNames, [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "closingCostsListMain",
  "singleTimeListMain",
  "ongoingListMain",
] as const);

export function UserComponents() {
  return (
    <Styled>
      <SectionTitle
        {...{
          text: (
            <LabelWithInfo
              {...{
                label: "Components",
                infoTitle: "Components",
                infoText: `Here you'll find different types of components that you can create, edit, and use as templates throughout the app. This is to reduce data entry, such as when itemizing costs for things like utilities and CapEx.`,
              }}
            />
          ),
        }}
      />
      {orderedNames.map((listName) => (
        <UserComponentClosed
          componentName={listName}
          className="UserComponents-component"
        />
      ))}
    </Styled>
  );
}

const Styled = styled.div`
  .UserComponents-component {
    margin-top: ${theme.dealElementSpacing};
  }
`;

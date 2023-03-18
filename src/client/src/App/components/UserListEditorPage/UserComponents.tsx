import { Arr } from "../../sharedWithServer/utils/Arr";
import theme from "../../theme/Theme";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
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
    <BackgroundContainer>
      <SectionTitle
        {...{
          text: (
            <LabelWithInfo
              {...{
                label: "Component Templates",
                infoTitle: "Components",
                infoText: `Here you'll find different types of components that you can create, edit, and use as templates throughout the app. This can reduce data entry by letting you reuse pieces of deals throughout the app, such as when itemizing costs for things like utilities and CapEx.`,
              }}
            />
          ),
        }}
      />
      {orderedNames.map((listName) => (
        <UserComponentClosed
          sx={{ marginTop: theme.dealElementSpacing }}
          key={listName}
          componentName={listName}
        />
      ))}
    </BackgroundContainer>
  );
}

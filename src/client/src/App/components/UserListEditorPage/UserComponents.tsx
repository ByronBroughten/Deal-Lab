import { Arr } from "../../sharedWithServer/utils/Arr";
import { nativeTheme } from "../../theme/nativeTheme";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { SectionTitle } from "../appWide/SectionTitle";
import { UserComponentClosed, userComponentNames } from "./UserComponentClosed";

const orderedNames = Arr.extractOrder(userComponentNames, [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "closingCostsListMain",
  "sellingListMain",
  "onetimeListMain",
  "ongoingListMain",
] as const);

export function UserComponents() {
  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <SectionTitle
          {...{
            text: (
              <LabelWithInfo
                {...{
                  label: "Deal Components",
                  infoTitle: "Components",
                  infoText: `Here you'll find different types of components that you can create, edit, and use as templates throughout the app. This can reduce data entry by letting you reuse pieces of deals throughout the app, such as when itemizing costs for things like utilities and CapEx.`,
                }}
              />
            ),
          }}
        />
        {orderedNames.map((listName, idx) => (
          <UserComponentClosed
            sx={{
              marginTop: idx === 0 ? nativeTheme.s45 : nativeTheme.s5,
            }}
            key={listName}
            componentName={listName}
          />
        ))}
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}

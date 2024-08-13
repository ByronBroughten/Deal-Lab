import { constant, constants } from "../../../sharedWithServer/Constants";
import { Arr } from "../../../sharedWithServer/utils/Arr";
import { nativeTheme } from "../../theme/nativeTheme";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { PageTitle } from "../appWide/PageTitle";
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
    <BackBtnWrapper {...{ to: "account", label: `${constants.appUnit} Menu` }}>
      <BackgroundContainer>
        <PageTitle
          {...{
            text: (
              <LabelWithInfo
                {...{
                  iconProps: { size: nativeTheme.pageInfoDotSize },
                  label: `${constant("appUnit")} Components`,
                  infoProps: {
                    title: `${constant("appUnit")} Components`,
                    info: `Here you can create and edit templates for different types of components that you can then plug in throughout the app. This way you don't have to repetetively input all the costs for things like utilities, Capital Expenses, and the like.`,
                  },
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

import { useAction } from "../../../modules/stateHooks/useAction";
import { useGetterSectionOnlyOne } from "../../../modules/stateHooks/useGetterSection";
import { constants } from "../../../sharedWithServer/Constants";
import { nativeTheme } from "../../../theme/nativeTheme";
import { IdOfSectionToSaveProvider } from "../../ContextsAndProviders/IdOfSectionToSaveProvider";
import { MuiRow } from "../../general/MuiRow";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { icons } from "../Icons";
import { SubSectionOpen } from "../Main/ActiveDealRoutes/ActiveDealStuff/SubSectionOpen";
import { CompareDealsDisplayBody } from "./CompareDealsDisplayBody";
import { CompareDealsEditBody } from "./CompareDealsEditBody";

export function CompareDealsPage() {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const session = useGetterSectionOnlyOne("sessionStore");
  const status = session.valueNext("compareDealStatus");

  const updateValue = useAction("updateValue");
  const editComparedDeals = () =>
    updateValue({
      ...session.varbInfo("compareDealStatus"),
      value: "editing",
    });

  return (
    <BackBtnWrapper
      {...{
        label: `${constants.appUnit} Menu`,
        to: "account",
        sx: { maxWidth: 900 },
      }}
    >
      <DealModeProvider dealMode={"mixed"}>
        <IdOfSectionToSaveProvider {...{ storeId: menu.mainStoreId }}>
          <SubSectionOpen
            sx={{
              overflow: "auto",
              paddingBottom: nativeTheme.s5,
              maxWidth: 900,
            }}
          >
            <MuiRow>
              <PageTitle text={`Compare ${constants.appUnitPlural}`} />
              {status === "comparing" && (
                <StyledActionBtn
                  {...{
                    sx: { marginLeft: nativeTheme.s2 },
                    left: icons.edit({ size: 20 }),
                    onClick: editComparedDeals,
                    middle: "Edit",
                  }}
                />
              )}
            </MuiRow>
            {status === "editing" && <CompareDealsEditBody />}
            {status === "comparing" && <CompareDealsDisplayBody />}
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}

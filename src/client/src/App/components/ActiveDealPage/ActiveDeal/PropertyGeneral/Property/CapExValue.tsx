import { AiOutlineInfoCircle } from "react-icons/ai";
import { Text } from "react-native";
import styled from "styled-components";
import { CapExValueMode } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../theme/Theme";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { VarbListCapEx } from "../../../../appWide/VarbLists/VarbListCapEx";
import { useToggleViewNext } from "./../../../../../modules/customHooks/useToggleView";
import { SectionModal } from "./../../../../appWide/SectionModal";
import { PlainIconBtn } from "./../../../../general/PlainIconBtn";

export function CapExValue({ feId }: { feId: string }) {
  const capExValue = useSetterSection({
    sectionName: "capExValue",
    feId,
  });
  const valueMode = capExValue.value("valueMode") as CapExValueMode;
  const valueVarb = capExValue.get.switchVarb("value", "ongoing");
  const showEquals: CapExValueMode[] = ["fivePercentRent"];
  const equalsValue = showEquals.includes(valueMode)
    ? valueVarb.displayVarb()
    : undefined;

  const { infoIsOpen, closeInfo, openInfo } = useToggleViewNext("info", false);
  return (
    <Styled
      {...{
        label: (
          <span className="CapExValue-label">
            <span>Capital Expense Budget</span>
            <PlainIconBtn
              onClick={openInfo}
              middle={
                <AiOutlineInfoCircle
                  size={20}
                  className="CapExValue-labelInfoCircle"
                />
              }
            />
            <SectionModal
              {...{
                show: infoIsOpen,
                closeModal: closeInfo,
                title: "Capital Expense Budget - What's That?",
              }}
            >
              <Text>
                {`Every property has expensive things will eventually need to be replaced—things like the roof, furnace, water heater, etc. No analysis of a long-term property is complete without somehow accounting for these eventual costs.\n\nA common (and easy) method that you may simply select is to assume that on average all of capital expense costs together will amount to about 5% of the property's purchase price, per year.\n\nIf on the other hand you prefer greater precision, you can select the "Itemize" option. Then for each major capital expense, estimate how much replacing it would cost and how many years that replacement would likely last. The app will then calculate how much you should budget per month for each capital expense as well as the total.`}
              </Text>
            </SectionModal>
          </span>
        ),
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          capExValue.varb("valueMode").updateValue(value);
        },
        menuItems: [
          [
            "fivePercentRent",
            `5% of rent${valueMode === "fivePercentRent" ? "" : " (simplest)"}`,
          ],
          [
            "itemize",
            `Itemize lifespan over cost${
              valueMode === "itemize" ? "" : " (more accurate)"
            }`,
          ],
          ["lumpSum", "Custom amount"],
        ],
        equalsValue,
        itemizedModalTitle: "CapEx Budget Itemizer",
        itemizeValue: "itemize",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <VarbListCapEx
            {...{
              feId: capExValue.oneChildFeId("capExList"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}

const Styled = styled(SelectAndItemizeEditorSection)`
  .CapExValue-label {
    display: flex;
    align-items: flex-end;
  }
  .CapExValue-labelInfoCircle {
    margin-left: ${theme.s2};
  }
`;

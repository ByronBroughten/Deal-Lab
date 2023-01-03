import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { AiFillEdit } from "react-icons/ai";
import styled from "styled-components";
import { useToggleViewNext } from "../../modules/customHooks/useToggleView";
import { VarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import PlainIconBtn from "../general/PlainIconBtn";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { NumObjEntityEditor } from "../inputs/NumObjEntityEditor";
import { SectionModal } from "./SectionModal";
import { SectionTitle } from "./SectionTitle";

type ValueSectionName = SectionNameByType<"valueSection">;
type MakeItemizedListNodeProps = {
  feId: string;
};
interface Props<SN extends ValueSectionName> {
  sectionName: SN;
  valueName: VarbName<SN>;
  makeItemizedListNode: (props: MakeItemizedListNodeProps) => React.ReactNode;
  className?: string;
  feId: string;
  displayName?: string;
}

function getChildName<SN extends ValueSectionName>(
  sectionName: SN
): ChildName<SN> {
  if (sectionName === "ongoingValue") return "ongoingList" as ChildName<SN>;
  else return "singleTimeList" as ChildName<SN>;
}

export function ValueSectionGeneric<
  SN extends SectionNameByType<"valueSection">
>({
  className,
  feId,
  displayName,
  sectionName,
  valueName,
  makeItemizedListNode,
}: Props<SN>) {
  const section = useSetterSection({ sectionName, feId });
  const listChildName = getChildName(sectionName);

  const isItemizedVarb = section.varb("isItemized");
  const isItemized = isItemizedVarb.value("boolean");
  const { modalIsOpen, openModal, closeModal } = useToggleViewNext(
    "modal",
    false
  );

  const displayNameValue = section
    .varb("displayName")
    .value("stringObj").mainText;

  return (
    <Styled className={`ValueSection-root ${className ?? ""}`}>
      <div className={"ValueSection-viewable"}>
        {displayName && <SectionTitle text={displayName} />}
        {!displayName && (
          <BigStringEditor
            {...{
              feVarbInfo: section.varbInfo("displayNameEditor"),
              placeholder: "Name",
            }}
          />
        )}
        <div className="ValueSection-value">
          {isItemized && (
            <span>{`Total: ${section.varb(valueName).get.displayVarb()}`}</span>
          )}
          {!isItemized && (
            <NumObjEntityEditor
              className={"ValueSection-valueEditor"}
              feVarbInfo={section.varbInfo("valueEditor")}
              labeled={false}
            />
          )}
        </div>
        <div className="ValueSection-itemizeControls">
          <FormGroup className="ValueSection-itemizeGroup">
            <FormControlLabel
              control={
                <Switch
                  {...{
                    name: "itemize switch",
                    checked: isItemized,
                    onChange: () => {
                      unstable_batchedUpdates(() => {
                        const nextValue = !isItemized;
                        isItemizedVarb.updateValue(nextValue);
                        nextValue && openModal();
                      });
                    },
                    size: "small",
                    color: "primary",
                  }}
                />
              }
              label="Itemize"
            />
          </FormGroup>
          {isItemized && (
            <PlainIconBtn
              className="ValueSection-editItemsBtn"
              onClick={openModal}
            >
              <AiFillEdit size={20} />
            </PlainIconBtn>
          )}
        </div>
      </div>
      <SectionModal
        {...{
          title: `Itemized ${displayName ?? displayNameValue}`,
          closeModal,
          show: modalIsOpen,
        }}
      >
        {makeItemizedListNode({
          feId: section.onlyChild(listChildName).feId,
        })}
      </SectionModal>
    </Styled>
  );
}

const Styled = styled.div`
  .ValueSection-viewable {
    height: ${theme.valueSectionSize};
    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }
  .ValueSection-editItemsBtn {
    color: ${theme.primaryNext};
  }

  .ValueSection-itemizeControls {
    display: flex;
    align-items: flex-end;
  }
  .ValueSection-itemizeGroup {
    margin-top: ${theme.s2};
    margin-left: ${theme.s25};
    .MuiFormControlLabel-root {
      margin-right: ${theme.s2};
      color: ${theme.primaryNext};

      .MuiSwitch-colorPrimary {
        color: ${theme["gray-500"]};
      }

      .MuiSwitch-colorPrimary.Mui-checked {
        color: ${theme.primaryNext};
      }
    }
  }

  .ValueSection-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${theme.s3};
    height: 25px;
  }

  .ValueSection-valueEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
`;

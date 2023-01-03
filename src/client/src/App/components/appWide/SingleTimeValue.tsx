import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import { unstable_batchedUpdates } from "react-dom";
import { AiFillEdit } from "react-icons/ai";
import styled from "styled-components";
import { useToggleViewNext } from "../../modules/customHooks/useToggleView";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import PlainIconBtn from "../general/PlainIconBtn";
import { NumObjEntityEditor } from "./../inputs/NumObjEntityEditor";
import { VarbListSingleTime } from "./ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { SectionModal } from "./SectionModal";
import { SectionTitle } from "./SectionTitle";

interface Props {
  className?: string;
  feId: string;
  displayName?: string;
}

export function SingleTimeValue({ className, feId, displayName }: Props) {
  const section = useSetterSection({
    sectionName: "singleTimeValue",
    feId,
  });

  const isItemizedVarb = section.varb("isItemized");
  const isItemized = isItemizedVarb.value("boolean");
  const { modalIsOpen, openModal, closeModal } = useToggleViewNext(
    "modal",
    false
  );

  return (
    <Styled className={`SingleTimeValue-root ${className ?? ""}`}>
      <div className={"SingleTimeValue-viewable"}>
        {displayName && <SectionTitle text={displayName} />}
        <div className="SingleTimeValue-value">
          {isItemized && (
            <span>{`Total: ${section.varb("value").get.displayVarb()}`}</span>
          )}
          {!isItemized && (
            <NumObjEntityEditor
              className={"SingleTimeValue-valueEditor"}
              feVarbInfo={section.varbInfo("valueEditor")}
              labeled={false}
            />
          )}
        </div>
        <div className="SingleTimeValue-itemizeControls">
          <FormGroup className="SingleTimeValue-itemizeGroup">
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
              className="SingleTimeValue-editItemsBtn"
              onClick={openModal}
            >
              <AiFillEdit size={20} />
            </PlainIconBtn>
          )}
        </div>
      </div>
      <SectionModal
        {...{
          title: `Itemized ${displayName}`,
          closeModal,
          show: modalIsOpen,
        }}
      >
        <VarbListSingleTime feId={section.onlyChild("singleTimeList").feId} />
      </SectionModal>
    </Styled>
  );
}

const Styled = styled.div`
  .SingleTimeValue-editItemsBtn {
    color: ${theme.primaryNext};
  }

  .SingleTimeValue-itemizeControls {
    display: flex;
    align-items: flex-end;
  }
  .SingleTimeValue-itemizeGroup {
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

  .SingleTimeValue-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${theme.s3};
    height: 25px;
  }

  .SingleTimeValue-valueEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }

  .SingleTimeValue-viewable {
    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }
`;

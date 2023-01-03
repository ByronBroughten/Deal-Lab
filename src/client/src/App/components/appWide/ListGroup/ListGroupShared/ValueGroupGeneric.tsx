import React from "react";
import styled from "styled-components";
import { VarbName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import {
  ChildNameOfType,
  ParentOfTypeName,
  SectionNameByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import useHowMany from "../../customHooks/useHowMany";
import { SectionBtn } from "../../SectionBtn";
import { SectionTitleAndCost } from "../../SectionTitleAndCost";
import {
  MakeValueNode,
  ValueGroupValues,
} from "./ListGroupGeneric/ValueGroupValues";

type ListParentName = ParentOfTypeName<"varbListAllowed">;

export type ListGroupGenericProps<SN extends ListParentName> = {
  valueParentInfo: FeSectionInfo<SN>;
  valueAsChildName: ChildName<SN>;
  makeValueNode: MakeValueNode;
  titleText: string;
  totalVarbName?: VarbName<SN>;
  className?: string;
  extraValueChildren?: React.ReactNode;
};

export function ValueGroupGeneric<
  SN extends ListParentName,
  CN extends ChildNameOfType<SN, "varbListAllowed">
>({
  valueParentInfo,
  valueAsChildName,
  makeValueNode,
  titleText,
  totalVarbName,
  className,
  extraValueChildren,
}: ListGroupGenericProps<SN>) {
  const parent = useSetterSection(valueParentInfo);
  const values = parent.get.children(
    valueAsChildName
  ) as GetterSection<any>[] as GetterSection<
    ChildSectionName<SN, CN> & SectionNameByType<"varbListAllowed">
  >[];
  const { areMultiple: areMultipleValues } = useHowMany(values);
  return (
    <Styled className={`ValueGroup-root ` + className ?? ""}>
      <div className="ValueGroup-viewable">
        <div className="ValueGroup-titleRow">
          <SectionTitleAndCost
            className="ValueGroup-titleRowLeft"
            text={titleText}
            cost={
              areMultipleValues && totalVarbName
                ? parent.get.varbNext(totalVarbName).displayVarb()
                : undefined
            }
          />
          <div className="ValueGroup-titleRowRight"></div>
        </div>
        <ValueGroupValues
          {...{
            feIds: values.map(({ feId }) => feId),
            makeValueNode,
            addValue: () => parent.addChild(valueAsChildName),
            extraValueChildren,
          }}
        />
      </div>
    </Styled>
  );
}

interface BtnProps extends StandardBtnProps {
  text?: React.ReactNode;
  icon?: React.ReactNode;
}
export function ListGroupGenericBtn({ className, ...props }: BtnProps) {
  return (
    <BtnStyled className={`ValueGroup-root ${className ?? ""}`} {...props} />
  );
}

const BtnStyled = styled(SectionBtn)`
  ${theme.sectionBorderChunk};
  padding: ${theme.sectionPadding};
  height: 260px;
  width: 200px;
  font-size: ${theme.titleSize};
`;

const Styled = styled.div`
  ${theme.sectionBorderChunk};
  padding: ${theme.sectionPadding};

  .ValueGroup-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .ValueGroup-titleRowLeft {
    display: flex;
    align-items: center;
    padding-left: ${theme.s1};
  }
`;

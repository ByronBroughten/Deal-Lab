import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import Mgmt from "./MgmtGeneral/Mgmt";
import Property from "./PropertyGeneral/Property";

type Props = {
  title: string;
  sectionName: "property" | "mgmt";
  className?: string;
};
const parentNames = {
  property: "propertyGeneral",
  mgmt: "mgmtGeneral",
} as const;
export default function InputSection({ title, sectionName, className }: Props) {
  const { analyzer } = useAnalyzerContext();

  const section = analyzer.parent(sectionName);
  const sectionIds = section.childFeIds(sectionName);

  return (
    <MainSection {...{ sectionName, className }}>
      <GeneralSectionTitle {...{ title, sectionName }} />
      <div className="MainSection-entries">
        {sectionIds.map((id) => {
          return sectionName === "property" ? (
            <Property {...{ id, key: id }} />
          ) : sectionName === "mgmt" ? (
            <Mgmt {...{ id, key: id }} />
          ) : null;
        })}
      </div>
    </MainSection>
  );
}

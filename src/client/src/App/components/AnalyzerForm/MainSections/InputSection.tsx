import React from "react";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import MainSection from "../../appWide/MainSection";
import Property from "./Properties/Property";
import MainSectionTitle from "../../appWide/MainSection/MainSectionTitle";
import Mgmt from "./Mgmts/Mgmt";

type Props = { title: string; sectionName: "property" | "mgmt" };
const parents = { property: "propertyGeneral", mgmt: "mgmtGeneral" } as const;
export default function InputSection({ title, sectionName }: Props) {
  const { analyzer } = useAnalyzerContext();
  const sectionIds = analyzer.childFeIds([parents[sectionName], sectionName]);

  return (
    <MainSection {...{ sectionName }}>
      <MainSectionTitle {...{ title, sectionName }} />
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

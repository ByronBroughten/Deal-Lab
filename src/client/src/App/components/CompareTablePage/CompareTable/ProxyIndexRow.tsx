import React from "react";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { IndexRow } from "./IndexRow";

type Props = { feId: string };
export function ProxyIndexRow({ feId }: Props) {
  const proxy = useGetterSection({
    sectionName: "proxyStoreItem",
    feId,
  });
  const { parent } = proxy;
  if (parent.isSectionType("compareTable")) {
    const dbInfo = {
      dbId: proxy.valueNext("dbId"),
      childName: "tableRow",
    } as const;

    if (parent.hasChildByDbInfo(dbInfo)) {
      const row = parent.childByDbId(dbInfo);
      return <IndexRow feId={row.feId} />;
    } else {
      return null;
    }
  } else {
    throw new Error("Parent is not a compareTable. That's no good.");
  }
}

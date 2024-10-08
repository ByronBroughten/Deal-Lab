import { SxProps } from "@mui/material";
import { useGetterMainOnlyChild } from "../../../../modules/stateHooks/useMain";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import { mixedInfoS } from "../../../../sharedWithServer/StateGetters/Identifiers/MixedSectionInfo";
import { fixedVarbOptionArrs } from "../../../../sharedWithServer/StateGetters/Identifiers/sectionPaths/varbPathOptions";
import { ValueCustomVarbPathInfo } from "../../../../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { collectionNamesFixed } from "../../../../sharedWithServer/StateGetters/Identifiers/VarbPathNameInfo";
import { DealMode } from "../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/dealMode";
import { OnVarbSelect } from "./NumObjVarbSelector/VarbSelectorCollection";
import { CollectionProps, VarbSelector } from "./VarbSelector";

type Props = {
  sx?: SxProps;
  nameFilter: string;
  onVarbSelect: OnVarbSelect;
  dealMode: DealMode<"plusMixed">;
};

export function VarbSelectorByDealMode({ dealMode, ...rest }: Props) {
  const latent = useGetterMainOnlyChild("latentDealSystem");
  const collectionProps: CollectionProps = [];

  const fixedCollections = useFixedCollections(dealMode);
  collectionProps.push(...fixedCollections);

  const userVarbCollections = useUserVarbCollections(latent);
  collectionProps.push(...userVarbCollections);
  return (
    <VarbSelector
      {...{
        ...rest,
        collectionProps,
      }}
    />
  );
}

function useFixedCollections(dealMode: DealMode<"plusMixed">): CollectionProps {
  const orderedCollectionNames = collectionNamesFixed;
  const optionArr = fixedVarbOptionArrs[dealMode];
  return orderedCollectionNames.map((collectionName) => {
    const rowInfos = optionArr
      .filter((p) => p.collectionName === collectionName)
      .map(({ varbPathName }) => mixedInfoS.varbPathName(varbPathName));
    return {
      collectionId: collectionName,
      collectionName,
      rowInfos,
    };
  });
}

function useUserVarbCollections(focal: GetterSection<any>): CollectionProps {
  const userVarbLists = focal.sectionsByFocalMixed({
    infoType: "pathName",
    pathName: "numVarbListMain",
  }) as GetterSection<"numVarbList">[];

  return userVarbLists.map((list) => {
    const collectionName = list.valueNext("displayName").mainText;
    const rowInfos = list.children("numVarbItem").map((item) => {
      const info: ValueCustomVarbPathInfo = {
        infoType: "varbPathDbId",
        varbPathName: "userVarbValue",
        dbId: item.dbId,
      };
      return info;
    });
    return { collectionName, rowInfos, collectionId: list.feId };
  });
}

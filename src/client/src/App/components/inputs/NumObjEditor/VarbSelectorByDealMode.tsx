import { SxProps } from "@mui/material";
import { mixedInfoS } from "../../../sharedWithServer/SectionsMeta/SectionInfo/MixedSectionInfo";
import { collectionNamesFixed } from "../../../sharedWithServer/SectionsMeta/SectionInfo/VarbPathNameInfo";
import { DealMode } from "../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { useGetterMainOnlyChild } from "../../../sharedWithServer/stateClassHooks/useMain";
import { ValueCustomVarbPathInfo } from "../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { fixedVarbOptionArrs } from "../../../sharedWithServer/StateEntityGetters/varbPathOptions";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { Arr } from "../../../sharedWithServer/utils/Arr";
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
  const orderedCollectionNames = Arr.extractStrict(collectionNamesFixed, [
    "Property",
    "Financing",
    "Management",
    "Deal",
  ] as const);

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

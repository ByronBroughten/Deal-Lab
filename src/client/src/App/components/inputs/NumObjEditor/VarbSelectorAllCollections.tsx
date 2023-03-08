import styled from "styled-components";
import { mixedInfoS } from "../../../sharedWithServer/SectionsMeta/SectionInfo/MixedSectionInfo";
import { collectionNamesFixed } from "../../../sharedWithServer/SectionsMeta/SectionInfo/VarbPathNameInfo";
import { ValueInEntityInfo } from "../../../sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";
import { useGetterSectionOnlyOne } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { varbPathOptionArr } from "../../../sharedWithServer/StateEntityGetters/pathNameOptions";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { Arr } from "../../../sharedWithServer/utils/Arr";
import ccs from "../../../theme/cssChunks";
import theme from "../../../theme/Theme";
import {
  OnVarbSelect,
  VarbSelectorCollection,
} from "./NumObjVarbSelector/VarbSelectorCollection";

type Props = {
  nameFilter: string;
  onVarbSelect: OnVarbSelect;
};

export function VarbSelectorAllCollections({
  onVarbSelect,
  nameFilter,
}: Props) {
  const latent = useGetterSectionOnlyOne("latentSections");
  const collectionProps: CollectionProps = [];

  const fixedCollections = useFixedCollections();
  collectionProps.push(...fixedCollections);

  const userVarbCollections = useUserVarbCollections(latent);
  collectionProps.push(...userVarbCollections);
  return (
    <Styled className="VarbSelectorAllCollections-root">
      {collectionProps.map(({ rowInfos, collectionId, ...rest }) => {
        const rowInfosNext = rowInfos.filter((info) => {
          const { displayNameFull } = latent.varbByFocalMixed(info);
          return displayNameFull
            .toLowerCase()
            .includes(nameFilter.toLowerCase());
        });
        return rowInfosNext.length > 0 ? (
          <VarbSelectorCollection
            {...{
              key: collectionId,
              onVarbSelect,
              rowInfos: rowInfosNext,
              ...rest,
            }}
          />
        ) : null;
      })}
    </Styled>
  );
}

type CollectionProps = {
  collectionId: string;
  collectionName: string;
  rowInfos: ValueInEntityInfo[];
}[];

function useFixedCollections(): CollectionProps {
  const orderedCollectionNames = Arr.extractStrict(collectionNamesFixed, [
    "Property",
    "Financing",
    "Management",
    "Deal",
  ] as const);

  return orderedCollectionNames.map((collectionName) => {
    const rowInfos = varbPathOptionArr
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
    pathName: "userVarbListMain",
  }) as GetterSection<"userVarbList">[];

  return userVarbLists.map((list) => {
    const collectionName = list.valueNext("displayName").mainText;
    const rowInfos = list.children("userVarbItem").map((item) => ({
      ...mixedInfoS.pathNameDbId("userVarbItemMain", item.dbId),
      varbName: "value",
    }));
    return { collectionName, rowInfos, collectionId: list.feId };
  });
}

const Styled = styled.div`
  ${ccs.dropdown.scrollbar};
  border: 1px solid ${theme.primary.light};
  border-radius: ${theme.br0};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
`;

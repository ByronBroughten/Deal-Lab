// class AddsSections<
//   AU extends UpdatesCoreAbstract<SimpleSectionName, any>
// > {
//   addSection(this: AU, parentFirstPropsArr: AddSectionProps[]) {
//     const newFeInfos: FeInfo[] = [];
//     for (const props of parentFirstPropsArr as AddSectionProps[]) {
//       next = initOneSectionNext(next, props);
//       const newFeInfo = next.lastSection(props.sectionName).feInfo;
//       newFeInfos.push(newFeInfo);
//     }
//   return finalizeNewSections(next, newFeInfos);
//   }
// }

// export function initOneSectionNext<AU extends UpdatesCoreAbstract<SimpleSectionName, any>>(
//   next: AU,
//   { idx, parentFinder, ...props }: AddSectionProps
// ): AU {
//   const { sectionName } = props;
//   next.update({
//     [sectionName]: next.core[sectionName].push(
//       FeSection.initNext({
//         parentInfo: next.parentFinderToInfo(parentFinder),
//         ...props,
//       })
//     )
//   })

//   next = pushSection(
//     next,
//     FeSection.initNext({
//       parentInfo: next.parentFinderToInfo(parentFinder),
//       ...props,
//     })
//   );

//   const { feInfo } = next.lastSection(sectionName);
//   if (sectionNameS.is(sectionName, "hasParent"))
//     next = addToParentChildIds(next, feInfo, idx);
//   return next;
// }

// function pushSection<AU extends UpdatesCoreAbstract<SimpleSectionName, any>>(
//   next: AU,
//   section: FeSection
// ): Analyzer {
//   const { sectionName } = section.meta.core;
//   const nextSectionArr = [
//     ...analyzer.sections[sectionName],
//     section,
//   ] as StateSection[];
//   return analyzer.updateSectionArr(sectionName, nextSectionArr);
// }

// function addToParentChildIds(
//   analyzer: Analyzer,
//   feInfo: FeInfo,
//   idx?: number
// ): Analyzer {
//   if (!Inf.is.fe(feInfo, "hasParent")) return analyzer;
//   const parentSection = analyzer.parent(feInfo);
//   const nextParent = parentSection.addChildFeId(feInfo, idx);
//   return analyzer.replaceInSectionArr(nextParent);
// }

// function finalizeNewSections(next: Analyzer, newFeInfos: FeInfo[]) {
//   next = initOutEntities(next, newFeInfos);
//   const varbInfosToSolveFor: FeVarbInfo[] = next.nestedFeVarbInfos(newFeInfos);
//   return next.addVarbsToSolveFor(...varbInfosToSolveFor);
// }

// function initOutEntities(next: Analyzer, newFeInfos: FeInfo[]) {
//   for (const feInfo of newFeInfos) {
//     next = addOutEntitiesForSectionInVarbs(next, feInfo);
//   }
//   return next;
// }

// function addOutEntitiesForSectionInVarbs(
//   analyzer: Analyzer,
//   feInfo: FeInfo
// ): Analyzer {
//   if (!Inf.is.fe(feInfo, "hasVarb")) return analyzer;
//   let next = analyzer;
//   const { varbs } = next.section(feInfo);
//   for (const [varbName, varb] of Object.entries(varbs)) {
//     for (const inEntity of varb.inEntities) {
//       const outEntity = { ...feInfo, varbName, entityId: inEntity.entityId };
//       next = internal.addOutEntity(next, inEntity, outEntity);
//     }
//   }
//   return next;
// }

import React from "react";

// import {
//   DbNumObj,
//   EntitiesAndEditorText,
//   FailedVarbs,
//   GetSolvableTextProps,
//   NumObj,
//   NumObjNumber,
// } from "../../../SectionMetas/relSections/baseSections/baseValues/NumObj";
// import { replaceRange } from "../../../../utils/Str";
// import Analyzer from "../../../../Analyzer";
// import {
//   FeVarbInfo,
//   SpecificVarbInfo,
// } from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
// import calculations, {
//   CalcProp,
//   CalculationName,
//   isCalculationName,
// } from "../../../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjUpdates/calculationUpdates";
// import {
//   isNumObjUpdateFnName,
//   NumObjUpdateFnName,
// } from "../../../SectionMetas/relSections/baseSections/baseValues/NumObj/updateFnNames";
// import {
//   arithmeticOperatorsArr,
//   decimalToPercent,
// } from "./../../../../utils/math";
// import { round } from "lodash";
// import { evaluate } from "mathjs";

// export type NumObjUnit = keyof typeof numObjUnits;
// // get number(): CalcProp {
// //   const number = NumObj.solveText(this.solvableText, this.core.unit);
// //   if (isRationalNumber(number)) return this.doFinishingTouches(number);
// //   else return "?";
// // }

// function doFinishingTouches(
//   num: number,
//   updateFnName: NumObjUpdateFnName
// ): number {
//   if (updateFnName === "divideToPercent") num = decimalToPercent(num);
//   return num;
// }
// function solveText(
//   text: string,
//   unit: NumObjUnit,
//   updateFnName: NumObjUpdateFnName
// ): NumObjNumber {
//   // the editor should handle when someone validly types left to right
//   if (text[text.length - 1] === ".")
//     // if there's a dot at the end, they could be about to enter a number
//     text = text.substring(0, text.length - 1);

//   if (text[text.length - 1] === "-")
//     // if there's a minus at the end, they might be subtracting
//     // or making a negative number, which could follow another operator
//     text = text.substring(0, text.length - 1);
//   if (arithmeticOperatorsArr.includes(text[text.length - 1]))
//     // if there's an operator before those things, it's valid
//     text = text.substring(0, text.length - 1);

//   try {
//     let num = evaluate(text);
//     if (typeof num === "number") {
//       num = doFinishingTouches(num, updateFnName);
//       return round(num, numObjUnits[unit].roundTo);
//     } else return "?";
//   } catch (ex) {
//     return "?";
//   }
// }

// export function solvableTextToNumber(
//   this: Analyzer,
//   feVarbInfo: FeVarbInfo,
//   solvableText: string
// ): NumObjNumber {
//   const updateFnName = this.updateFnName(feVarbInfo);
//   if (isNumObjUpdateFnName(updateFnName)) {
//     const { unit } = this.varb(feVarbInfo);
//     return solveText(solvableText, unit, updateFnName);
//   } else {
//     throw new Error("For now, this is only for numObjs.");
//   }
// }

// export function getSolvableNumber(
//   this: Analyzer,
//   feVarbInfo: SpecificVarbInfo
// ): NumObjNumber {
//   const varb = this.findVarb(feVarbInfo);
//   if (!varb) return "?";
//   return varb.value("numObj").number;
// }

// export function solvableTextFromCalculation(
//   this: Analyzer,
//   feVarbInfo: FeVarbInfo
// ) {
//   const updateFnName = this.updateFnName(feVarbInfo);
//   if (!isCalculationName(updateFnName))
//     throw new Error(
//       `updateFnName is ${updateFnName}, but this is only for pure calculations`
//     );

//   const { numberVarbs } = this.getNumberVarbs(feVarbInfo);
//   const solvableText = calculations[updateFnName](numberVarbs as any);
//   return solvableText;
// }
// export function solvableTextFromCalcVarbs(
//   this: Analyzer,
//   feVarbInfo: FeVarbInfo
// ): string {
//   const updateFnName = this.updateFnName(feVarbInfo);
//   if (updateFnName !== "calcVarbs")
//     throw new Error("This is only for calcVarbs");

//   const { core } = this.value(feVarbInfo, "numObj");
//   return this.solvableTextFromEditorTextAndEntities(core);
// }
// export function solvableTextFromEditorTextAndEntities(
//   this: Analyzer,
//   { editorText, entities }: DbNumObj
// ): string {
//   let solvableText = editorText;
//   for (const entity of entities) {
//     const num = this.getSolvableNumber(entity);
//     solvableText = replaceRange(
//       solvableText,
//       entity.offset,
//       entity.offset + entity.length,
//       `${num}`
//     );
//   }
//   return solvableText;
// }

// export type NumberProps = { [name: string]: CalcProp | CalcProp[] };
// export function getNumberVarbs(
//   this: Analyzer,
//   feVarbInfo: FeVarbInfo
// ): {
//   numberVarbs: NumberProps;
//   failedVarbs: FailedVarbs;
// } {
//   //

//   const numberVarbs: NumberProps = {};
//   const failedVarbs: FailedVarbs = [];
//   const updateFnProps = this.updateFnProps(feVarbInfo);

//   for (let [propName, propOrArr] of Object.entries(updateFnProps)) {
//     if (Array.isArray(propOrArr)) numberVarbs[propName] = [];
//     else propOrArr = [propOrArr];
//     for (const relInfo of propOrArr) {
//       const inVarbs = this.varbsByFocal(feVarbInfo, relInfo);
//       for (const inVarb of inVarbs) {
//         const value = inVarb.value();
//         if (!(value instanceof NumObj)) continue;
//         let { number: num } = inVarb.value("numObj");
//         if (num === "?") {
//           failedVarbs.push({
//             errorMessage: "failed varb",
//             ...relInfo,
//           });
//         }
//         const numArr = numberVarbs[propName];
//         if (Array.isArray(numArr)) numArr.push(num);
//         else numberVarbs[propName] = num;
//       }
//     }
//   }

//   return { numberVarbs, failedVarbs };
// }

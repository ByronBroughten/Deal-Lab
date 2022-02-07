export default function useHowMany(arr: any[]) {
  return {
    areNone: arr.length === 0,
    isAtLeastOne: arr.length > 0,
    areMultiple: arr.length > 1,
  };
}

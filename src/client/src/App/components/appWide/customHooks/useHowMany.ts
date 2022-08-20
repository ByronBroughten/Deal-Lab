export default function useHowMany(arr: any[]) {
  return {
    get areNone() {
      return arr.length === 0;
    },
    get isEven() {
      return arr.length % 2 === 0;
    },
    get isOne() {
      return arr.length === 1;
    },
    get isAtLeastOne() {
      return arr.length >= 1;
    },
    get areMultiple() {
      return arr.length > 1;
    },
  };
}

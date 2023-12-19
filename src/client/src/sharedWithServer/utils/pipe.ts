export const pipe = <V extends any, C extends (v: V, ...args: any) => V>(
  value: V
) => ({
  value,
  to: (cb: C, ...args: any) => pipe(cb(value, ...args)),
});

const plus = (x: number, y: number) => x + y;
const divide = (x: number, y: number) => x / y;
const multiply = (x: number, y: number) => x * y;

const { value } = pipe(5).to(plus, 10).to(divide, 2).to(multiply, 3);

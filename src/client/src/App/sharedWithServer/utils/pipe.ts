// Alias because TS function types get tedious fast
type Fn<A, B> = (_: A) => B;

// Describe the shape of Pipe. We can't actually use `class` because while TS
// supports application syntax in types, it doesn't in object literals or classes.
interface Pipe<A, B> extends Fn<A, B> {
  // More idiomatic in the land of FP where `pipe` has its origins would be
  // `map` / `fmap`, but this feels more familiar to the average JS/TS-er.
  then<C>(g: Fn<B, C>): Pipe<A, C>;
}

// Builds the `id` function as a Pipe.
export function pipe<A>(): Pipe<A, A> {
  // Accept a function, and promise to augment it.
  function _pipe<A, B>(f: Fn<A, B>): Pipe<A, B> {
    // Take our function and start adding stuff.
    return Object.assign(f, {
      // Accept a function to tack on, also with augmentations.
      then<C>(g: Fn<B, C>): Pipe<A, C> {
        // Compose the functions!
        return _pipe<A, C>((a) => g(f(a)));
      },
    });
  }
  // Return an augmented `id`
  return _pipe((a) => a);
}

const foo = pipe<number>()
  .then((x) => x + 1)
  .then((x) => `hey look ${x * 2} a string!`)
  .then((x) => x.substr(0, x.length) + Array(5).join(x.substring(x.length - 1)))
  .then(console.log);

foo(3); // "hey look 8 a string!!!!!"

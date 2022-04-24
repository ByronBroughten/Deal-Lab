import { applyMixins } from "../utils/classObjects";
import {
  FeSectionsCore,
  UpdatesCoreAbstract,
} from "./FeSections/UpdatesCoreAbstract";
import { SimpleSectionName } from "./SectionMetas/baseSections";

interface FeSections<SN extends SimpleSectionName> {}
class FeSections<SN extends SimpleSectionName> extends UpdatesCoreAbstract<
  SN,
  FeSections<SN>
> {
  update(partial: Partial<FeSectionsCore<SN>>): FeSections<SN> {
    return new FeSections({ ...this.core, ...partial } as FeSectionsCore<SN>);
  }
}

// interface BigClass<T extends CoreType> extends MakePropFoo<BigClass<T>> {}
// applyMixins(BigClass, [MakePropFoo]);

type CoreType = "tOne" | "tTwo" | "tThree";

type Core<T extends CoreType> = {
  coreType: T;
  mutable: {
    prop1: string;
    prop2: string;
  };
};

type CoreUpdateProps<T extends CoreType> = Partial<Core<T>["mutable"]>;

class HasPropCore<T extends CoreType> {
  constructor(readonly core: Core<T>) {}
}

abstract class AbstractUpdateCore<
  R,
  T extends CoreType
> extends HasPropCore<T> {
  abstract update(coreMutable: CoreUpdateProps<T>): R;
}

class Updater<T extends CoreType> extends AbstractUpdateCore<Updater<T>, T> {
  constructor(readonly core: Core<T>) {
    super(core);
  }
  update(coreMutable: CoreUpdateProps<T>) {
    return new Updater({
      ...this.core,
      mutable: {
        ...this.core.mutable,
        ...coreMutable,
      },
    });
  }
}

class MakePropFoo<A extends AbstractUpdateCore<any, CoreType>> {
  makePropFoo(this: A): A {
    return this.update({ prop1: "foo" });
  }
}

class BigClass<T extends CoreType> extends AbstractUpdateCore<BigClass<T>, T> {
  constructor(readonly core: Core<T>) {
    super(core);
  }
  iAmDerived() {
    console.log("I am derived.");
  }
  update(coreMutable: CoreUpdateProps<T>) {
    return new BigClass({
      ...this.core,
      mutable: {
        ...this.core.mutable,
        ...coreMutable,
      },
    });
  }
}

interface BigClass<T extends CoreType> extends MakePropFoo<BigClass<T>> {}
applyMixins(BigClass, [MakePropFoo]);

const initCore = {
  coreType: "tOne",
  mutable: {
    prop1: "lo",
    prop2: "la",
  },
} as const;
const updater = new Updater(initCore);
const nextUpdater = updater.update({ prop1: "I am updated" });
console.log(nextUpdater.core.mutable.prop1);

const big = new BigClass(initCore);
console.log(big.core.mutable.prop1);

const updated = big.makePropFoo();
updated.iAmDerived();

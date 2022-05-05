import FeSection from "./FeSections/FeSection";
import { FeSectionList } from "./FeSections/FeSectionList";
import {
  FeSectionLists,
  UpdatesCoreAbstract,
} from "./FeSections/UpdatesCoreAbstract";
import { SimpleSectionName } from "./SectionMetas/baseSections";
import { SelfOrDescendantName } from "./SectionMetas/relSectionTypes/ChildTypes";

// I should make an FeSections core that all of these return.
// It only needs the update functions.
// Hmmmm...
// There could be a readonly version that each of these accept as arguments.

// What about the sectionReplacer?
// Yeah, so then each of these update their own core
// Hmmm....

// Each of these spits out the same core
// The core has a "readonly" property that produces a readonly
// version of itself.

// So first I'll make the readonly version
// then I'll make the updater version
// Is that really necessary, though?

// I'll make a core with getters and the basic update utilities
// It can't mutate itself, afterall.

// And then on top of that I'll create the other classes, and they'll
// all just pass around the core.

// replaceInList... I guess that belongs there, right?
// Ok, so FeSections is the core.

interface FeSections<SN extends SimpleSectionName>
  extends UpdatesCoreAbstract<SN, FeSections<SN>> {}
class FeSections<SN extends SimpleSectionName> extends UpdatesCoreAbstract<
  SN,
  FeSections<SN>
> {
  updateList<LN extends SelfOrDescendantName<SN>>(
    listName: LN,
    nextList: FeSectionList<LN>
  ): FeSections<SN> {
    return this.updateLists({
      [listName]: nextList,
    } as Partial<FeSectionLists<SN>>);
  }
  updateLists(partial: Partial<FeSectionLists<SN>>): FeSections<SN> {
    return new FeSections({
      ...this.core,
      sectionLists: { ...this.core.sectionLists, ...partial },
    });
  }
  replaceInList(
    nextSection: FeSection<SelfOrDescendantName<SN>>
  ): FeSections<SN> {
    const { sectionName } = nextSection;
    return this.updateList(
      sectionName,
      this.list(sectionName).replace(nextSection)
    );
  }
}

// applyMixins(FeSections, []);

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

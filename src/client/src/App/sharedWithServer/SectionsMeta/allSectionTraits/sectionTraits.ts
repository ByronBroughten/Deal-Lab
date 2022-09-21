
export function sectionTraits<
O extends Options = {}
>(options?: O): SectionTraits<O> {
return {
  ...defaultProps,
  ...options,
} as any;
}
export type SectionTraits<O extends Options={}> = Merge<DefaultProps, Options>;

export type GeneralSectionTraits = {
    hasGlobalVarbs: boolean;
    displayName: string;
    varbListItem: string | null;
    tableIndexName: BaseName | null;
    tableStoreName: BaseName | null;

    compareTableName: ChildSectionNameName<"feUser", "compareTable"> | null;
    feDisplayIndexStoreName: ChildSectionNameName<
        "feUser",
        "displayNameList"
    > | null;
    feFullIndexStoreName: ChildName<"feUser"> | null;
    dbIndexStoreName: ChildName<"dbStore"> | null;
    dbArrStoreName: ChildName<"dbStore"> | null;
};


type Options = Partial<GeneralSectionTraits>;
function makeDefault<O extends Options>(options: O): O {
    return options;
}  
const defaultProps = makeDefault({
    displayName: "",
    varbListItem: null,
    tableIndexName: null,
    tableStoreName: null,

    compareTableName: null,
    feDisplayIndexStoreName: null,
    feFullIndexStoreName: null,
    dbIndexStoreName: null,
    dbArrStoreName: null,
});
type DefaultProps = typeof defaultProps;
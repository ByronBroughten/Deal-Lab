export const getEntityStrategy = (mutability: string) => {
  return (contentBlock: any, callback: Function, contentState: any) => {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };
};

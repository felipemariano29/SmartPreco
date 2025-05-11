export class DtoMapper {

  /**
   * Maps a single entity to a DTO using a provided transformer.
   * @param entity The entity to transform
   * @param transformer The mapping function
   */
  public static mapOne<Entity, Dto>(entity: Entity, transformer: (entity: Entity) => Dto): Dto {
    return transformer(entity);
  }

  /**
   * Maps an array of entities to an array of DTOs using a provided transformer.
   * @param entities Array of entities
   * @param transformer Mapping function
   */
  public static mapMany<Entity, Dto>(entities: Entity[], transformer: (entity: Entity) => Dto): Dto[] {
    return entities.map(transformer);
  }

}
import { Repository, DeepPartial, EntityManager, ObjectType, FindOptionsWhere, FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';

/**
 * A generic base repository class that provides common data access methods
 * for entities managed by TypeORM. This class simplifies CRUD operations
 * and can be extended for entity-specific repositories.
 *
 * @template T - The entity type managed by the repository.
 */
@Injectable()
export class BaseRepository<T> {
  private readonly entity: ObjectType<T>;

  /**
   * Initializes the base repository with a specific TypeORM `Repository` instance.
   *
   * @param repository - The TypeORM `Repository` instance that provides database access methods for the entity.
   */
  constructor(private readonly repository: Repository<T>) {
    this.entity = repository.metadata.target as ObjectType<T>;
  }

  /**
   * Retrieves the appropriate repository for the entity, using the provided `EntityManager` if available.
   *
   * @param manager - Optional `EntityManager` to use for transaction support. If not provided, uses the default repository.
   * @returns The repository instance for the entity.
   */
  getRepository(manager?: EntityManager): Repository<T> {
    return manager ? manager.getRepository(this.entity) : this.repository;
  }

  /**
  * Retrieves the appropriate repository for the entity, using the provided `EntityManager` if available.
  *
  * @param manager - Optional `EntityManager` to use for transaction support. If not provided, uses the default repository.
  * @returns The repository instance for the entity.
  */
  getQueryBuilder(alias?: string, manager?: EntityManager) {
    const repo = this.getRepository(manager);
    return repo.createQueryBuilder(alias);
  }


  /**
   * Saves an entity to the database.
   *
   * This method persists a given entity (or partial entity) to the database.
   * If the entity is new, it will be inserted; if it already exists, it will be updated.
   * Supports optional transaction via `EntityManager`.
   *
   * @param entity - A `DeepPartial<T>` object representing the entity to save.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to the saved entity.
   *
   * @example
   * ```typescript
   * const savedEntity = await baseRepository.save(entity);
   * ```
   */
  async save(entity: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    const repo = this.getRepository(manager);
    return repo.save(entity);
  }

  /**
   * Creates a new entity instance without saving it to the database.
   *
   * This method is useful for creating entities with default values and type checking,
   * without persisting them immediately.
   *
   * @param entity - A `DeepPartial<T>` object representing the entity to create.
   * @returns A new instance of the entity.
   *
   * @example
   * ```typescript
   * const newEntity = baseRepository.createEntity(partialEntity);
   * ```
   */
  createEntity(entity: DeepPartial<T>): T {
    return this.repository.create(entity);
  }

  /**
   * Finds a single entity by its ID.
   *
   * This method retrieves an entity from the database using the provided ID.
   * It utilizes TypeORM's `findOneBy` method to query the entity.
   * Supports optional transaction via `EntityManager`.
   *
   * @param id - The ID of the entity to retrieve.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to the found entity or `null` if not found.
   *
   * @example
   * ```typescript
   * const entity = await baseRepository.findOne('entityId');
   * ```
   */
  async findOne(id: string, manager?: EntityManager): Promise<T | null> {
    const repo = this.getRepository(manager);
    return repo.findOneBy({ id } as any);
  }

  /**
   * Finds a single entity by a given condition.
   *
   * This method retrieves an entity from the database using the provided condition.
   * It utilizes TypeORM's `findOneBy` method to query the entity.
   * Supports optional transaction via `EntityManager`.
   *
   * @param condition - The condition to find the entity by.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to the found entity or `null` if not found.
   *
   * @example
   * ```typescript
   * const entity = await baseRepository.findOneBy({ name: 'example' });
   */
  async findOneBy(
    condition: Partial<T>,
    manager?: EntityManager,
  ): Promise<T | null> {
    const repo = this.getRepository(manager);
    return repo.findOneBy(condition as FindOptionsWhere<T>);
  }

  /**
   * Finds a single entity by a given condition.
   *
   * This method retrieves an entity from the database using the provided condition.
   * It utilizes TypeORM's `findOneBy` method to query the entity.
   * Supports optional transaction via `EntityManager`.
   *
   * @param condition - The condition to find the entity by.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to the found entity or `null` if not found.
   *
   * @example
   * ```typescript
   * const entity = await baseRepository.findOneBy({ name: 'example' });
   */
  async findOneByWithOptions(
    options: FindOneOptions<T>,
    manager?: EntityManager,
  ): Promise<T | null> {
    const repo = this.getRepository(manager);
    return repo.findOne(options);
  }
  /**
   * Retrieves all entities of type `T` from the database.
   *
   * This method retrieves all instances of the entity type `T` from the database.
   * It uses TypeORM's `find` method, which returns all rows from the corresponding table.
   * Supports optional transaction via `EntityManager`.
   *
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to an array of all entities.
   *
   * @example
   * ```typescript
   * const entities = await baseRepository.findAll();
   * ```
   */
  async findAll(manager?: EntityManager): Promise<T[]> {
    const repo = this.getRepository(manager);
    return repo.find();
  }

  /**
   * Updates an entity with the given ID.
   *
   * This method updates an existing entity by its ID using the provided partial entity data.
   * After updating, it fetches the updated entity from the database and returns it.
   * Supports optional transaction via `EntityManager`.
   *
   * @param id - The ID of the entity to update.
   * @param entity - A `DeepPartial<T>` object containing the data to update.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to the updated entity or `null` if not found.
   *
   * @example
   * ```typescript
   * const updatedEntity = await baseRepository.update('entityId', partialEntity);
   * ```
   */
  async update(
    id: string,
    entity: DeepPartial<T>,
    manager?: EntityManager,
  ): Promise<T | null> {
    const repo = this.getRepository(manager);
    await repo.update(id, entity as any);
    return repo.findOneBy({ id } as any);
  }

  /**
   * Removes an entity with the given ID from the database.
   *
   * This method deletes an entity identified by the given ID from the database.
   * Supports optional transaction via `EntityManager`.
   *
   * @param id - The ID of the entity to remove.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves when the deletion is complete.
   *
   * @example
   * ```typescript
   * await baseRepository.remove('entityId');
   * ```
   */
  async remove(id: string, manager?: EntityManager): Promise<void> {
    const repo = this.getRepository(manager);
    await repo.delete(id);
  }

/**
 * Saves multiple entities to the database.
 *
 * This method persists an array of entities (or partial entities) to the database.
 * If an entity is new, it will be inserted; if it already exists, it will be updated.
 * Supports optional transaction via `EntityManager`.
 *
 * @param entities - An array of `DeepPartial<T>` objects representing the entities to save.
 * @param manager - Optional `EntityManager` for transactional operations.
 * @returns A promise that resolves to the saved entities.
 *
 * @example
 * ```typescript
 * const savedEntities = await baseRepository.saveAll(entities);
 * */
  async saveAll(entities: DeepPartial<T[]>, manager?: EntityManager): Promise<T[]> {
    const repo = this.getRepository(manager);
    return repo.save(entities);
  }
}

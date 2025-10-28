/**
 * Base repository interface for data access operations.
 * Provides a standard contract for CRUD operations on entities.
 * @template T The entity type
 */
export interface IRepository<T> {
  /**
   * Get an entity by its ID
   * @param id The entity ID
   * @returns Promise resolving to the entity
   */
  getById(id: string): Promise<T>;

  /**
   * Get all entities, optionally filtered
   * @param params Optional query parameters for filtering/sorting
   * @returns Promise resolving to array of entities
   */
  getAll(params?: Record<string, any>): Promise<T[]>;

  /**
   * Create a new entity
   * @param data The entity data to create
   * @returns Promise resolving to the created entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   * @param id The entity ID
   * @param data The fields to update
   * @returns Promise resolving to the updated entity
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete an entity
   * @param id The entity ID
   * @returns Promise resolving when deletion is complete
   */
  delete(id: string): Promise<void>;
}

/**
 * Extended repository interface with search capabilities
 */
export interface ISearchableRepository<T> extends IRepository<T> {
  /**
   * Search entities by query string
   * @param query Search query
   * @param params Optional additional parameters
   * @returns Promise resolving to search results
   */
  search(query: string, params?: Record<string, any>): Promise<T[]>;
}

/**
 * Repository interface with pagination support
 */
export interface IPaginatedRepository<T> extends IRepository<T> {
  /**
   * Get paginated results
   * @param page Page number (1-indexed)
   * @param limit Items per page
   * @param params Optional query parameters
   * @returns Promise resolving to paginated results
   */
  getPaginated(
    page: number,
    limit: number,
    params?: Record<string, any>
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }>;
}

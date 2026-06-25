// Cursor-based pagination
// TODO: Add pagination utilities
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export class PaginationHelper {
  public static getPaginationParams(params: PaginationParams): {
    skip: number;
    take: number;
    orderBy: Record<string, 'asc' | 'desc'>;
    cursor?: Record<string, string>;
  } {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [params.sortBy || 'createdAt']: params.sortOrder || 'desc',
    };

    if (params.cursor) {
      return {
        skip: 0,
        take: limit,
        orderBy,
        cursor: {
          id: params.cursor,
        },
      };
    }

    return { skip, take: limit, orderBy };
  }

  public static createPaginationMeta(
    total: number,
    params: PaginationParams
  ): PaginationMeta {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  public static createPaginatedResponse<T>(
    data: T[],
    total: number,
    params: PaginationParams
  ): PaginatedResponse<T> {
    return {
      data,
      meta: this.createPaginationMeta(total, params),
    };
  }
}
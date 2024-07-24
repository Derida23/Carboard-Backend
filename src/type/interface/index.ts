
export interface TypeFilters {
  start_date?: string;
  end_date?: string;
  name?: string;
}

export interface PageFilters {
  page?: number;
  per_page?: number;
}

export interface TypeWhere {
  created_at?: { gte?: Date; lte?: Date };
  name?: { contains: string; mode: 'insensitive' };
}
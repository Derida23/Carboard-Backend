export interface Fuel {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at?: Date
  deleted_at?: Date
}
export interface FuelFilters {
  start_date?: string;
  end_date?: string;
  name?: string;
}

export interface PageFilters {
  page?: number;
  per_page?: number;
}

export interface FuelWhere {
  created_at?: { gte?: Date; lte?: Date };
  name?: { contains: string; mode: 'insensitive' };
}
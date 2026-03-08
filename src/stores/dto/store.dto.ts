// Store DTOs - Data Transfer Objects for Store entity
export enum StoreType {
  WAREHOUSE = "WAREHOUSE",
  BRANCH = "BRANCH",
  SHOP = "SHOP",
}

// Create Store DTO - Request payload for creating new store
export class CreateStoreDto {
  code: string;
  nameTh: string;
  nameEn: string;
  type: StoreType;
  address?: string;
  createdBy: string;
}

// Update Store DTO - Request payload for updating existing store
export class UpdateStoreDto {
  nameTh?: string;
  nameEn?: string;
  type?: StoreType;
  address?: string;
  updatedBy: string;
}

// Store Response DTO - Response payload for store data
export class StoreResponseDto {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  type: StoreType;
  address: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

// Query Store DTO - Query parameters for listing stores
export class QueryStoreDto {
  search?: string;
  type?: StoreType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

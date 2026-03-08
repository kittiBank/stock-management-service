// Store DTOs - Data Transfer Objects for Store entity
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum StoreType {
  WAREHOUSE = "WAREHOUSE",
  BRANCH = "BRANCH",
  SHOP = "SHOP",
}

// Create Store DTO - Request payload for creating new store
export class CreateStoreDto {
  @ApiProperty({ example: "WH001", description: "Unique store code" })
  code: string;

  @ApiProperty({ example: "คลังสินค้าหลัก", description: "Store name in Thai" })
  nameTh: string;

  @ApiProperty({
    example: "Main Warehouse",
    description: "Store name in English",
  })
  nameEn: string;

  @ApiProperty({
    enum: StoreType,
    example: StoreType.WAREHOUSE,
    description: "Store type",
  })
  type: StoreType;

  @ApiPropertyOptional({
    example: "123 ถนนสุขุมวิท กรุงเทพฯ",
    description: "Store address",
  })
  address?: string;

  @ApiProperty({ example: "admin", description: "Creator username" })
  createdBy: string;
}

// Update Store DTO - Request payload for updating existing store
export class UpdateStoreDto {
  @ApiPropertyOptional({
    example: "คลังสินค้าใหม่",
    description: "Store name in Thai",
  })
  nameTh?: string;

  @ApiPropertyOptional({
    example: "New Warehouse",
    description: "Store name in English",
  })
  nameEn?: string;

  @ApiPropertyOptional({ enum: StoreType, description: "Store type" })
  type?: StoreType;

  @ApiPropertyOptional({
    example: "456 ถนนรัชดา",
    description: "Store address",
  })
  address?: string;

  @ApiProperty({ example: "admin", description: "Updater username" })
  updatedBy: string;
}

// Store Response DTO - Response payload for store data
export class StoreResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "WH001" })
  code: string;

  @ApiProperty({ example: "คลังสินค้าหลัก" })
  nameTh: string;

  @ApiProperty({ example: "Main Warehouse" })
  nameEn: string;

  @ApiProperty({ enum: StoreType, example: StoreType.WAREHOUSE })
  type: StoreType;

  @ApiPropertyOptional({ example: "123 ถนนสุขุมวิท กรุงเทพฯ", nullable: true })
  address: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: "admin" })
  createdBy: string;

  @ApiProperty({ example: "2026-03-08T10:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "admin" })
  updatedBy: string;

  @ApiProperty({ example: "2026-03-08T10:00:00.000Z" })
  updatedAt: Date;
}

// Query Store DTO - Query parameters for listing stores
export class QueryStoreDto {
  @ApiPropertyOptional({
    example: "WH",
    description: "Search by code, name_th, or name_en",
  })
  search?: string;

  @ApiPropertyOptional({ enum: StoreType, description: "Filter by store type" })
  type?: StoreType;

  @ApiPropertyOptional({
    example: true,
    description: "Filter by active status",
  })
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, description: "Page number", default: 1 })
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: "Items per page",
    default: 10,
  })
  limit?: number;
}

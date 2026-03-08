// User DTOs - Data Transfer Objects for User Management
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

// Create User DTO - Request payload for creating new user
export class CreateUserDto {
  @ApiProperty({ example: "john.doe", description: "Unique username" })
  username: string;

  @ApiProperty({
    example: "password123",
    description: "User password (will be hashed)",
  })
  password: string;

  @ApiProperty({ example: "John", description: "First name" })
  firstname: string;

  @ApiProperty({ example: "Doe", description: "Last name" })
  lastname: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.STAFF,
    description: "User role",
  })
  role?: UserRole;

  @ApiProperty({ example: "admin", description: "Creator username" })
  createdBy: string;
}

// Update User DTO - Request payload for updating existing user
export class UpdateUserDto {
  @ApiPropertyOptional({ example: "John", description: "First name" })
  firstname?: string;

  @ApiPropertyOptional({ example: "Doe", description: "Last name" })
  lastname?: string;

  @ApiPropertyOptional({ enum: UserRole, description: "User role" })
  role?: UserRole;

  @ApiProperty({ example: "admin", description: "Updater username" })
  updatedBy: string;
}

// Change Password DTO - Request payload for changing user password
export class ChangePasswordDto {
  @ApiProperty({ example: "oldPassword123", description: "Current password" })
  currentPassword: string;

  @ApiProperty({ example: "newPassword456", description: "New password" })
  newPassword: string;

  @ApiProperty({ example: "admin", description: "Updater username" })
  updatedBy: string;
}

// User Response DTO - Response payload excluding sensitive data
export class UserResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "john.doe" })
  username: string;

  @ApiProperty({ example: "John" })
  firstname: string;

  @ApiProperty({ example: "Doe" })
  lastname: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STAFF })
  role: UserRole;

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

// Query User DTO - Query parameters for listing users
export class QueryUserDto {
  @ApiPropertyOptional({
    example: "john",
    description: "Search by username, firstname, or lastname",
  })
  search?: string;

  @ApiPropertyOptional({ enum: UserRole, description: "Filter by role" })
  role?: UserRole;

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

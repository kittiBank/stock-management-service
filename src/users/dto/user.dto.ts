// User DTOs - Data Transfer Objects for User Management
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

// Create User DTO - Request payload for creating new user
export class CreateUserDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: UserRole;
  createdBy: string;
}

// Update User DTO - Request payload for updating existing user
export class UpdateUserDto {
  firstname?: string;
  lastname?: string;
  role?: UserRole;
  updatedBy: string;
}

// Change Password DTO - Request payload for changing user password
export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  updatedBy: string;
}

// User Response DTO - Response payload excluding sensitive data
export class UserResponseDto {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

// Query User DTO - Query parameters for listing users
export class QueryUserDto {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

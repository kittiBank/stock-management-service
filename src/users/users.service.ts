// Users service - Business logic for user management
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  QueryUserDto,
  UserResponseDto,
} from "./dto";
import * as crypto from "crypto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  private toResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      isActive: user.is_active,
      createdBy: user.created_by,
      createdAt: user.created_at,
      updatedBy: user.updated_by,
      updatedAt: user.updated_at,
    };
  }

  // Create user - validate unique username, hash password
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.users.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const now = new Date();
    const user = await this.prisma.users.create({
      data: {
        username: dto.username,
        password: this.hashPassword(dto.password),
        firstname: dto.firstname,
        lastname: dto.lastname,
        role: dto.role || "STAFF",
        is_active: true,
        created_by: dto.createdBy,
        created_at: now,
        updated_by: dto.createdBy,
        updated_at: now,
      },
    });

    return this.toResponseDto(user);
  }

  // Find all users with optional search
  async findAll(
    query: QueryUserDto,
  ): Promise<{ data: UserResponseDto[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { username: { contains: query.search, mode: "insensitive" } },
        { firstname: { contains: query.search, mode: "insensitive" } },
        { lastname: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.isActive !== undefined) {
      where.is_active = query.isActive;
    }

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data: users.map((user) => this.toResponseDto(user)),
      total,
    };
  }

  // Find one user by ID
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toResponseDto(user);
  }

  // Update user - validate existence, update fields
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        ...(dto.firstname && { firstname: dto.firstname }),
        ...(dto.lastname && { lastname: dto.lastname }),
        ...(dto.role && { role: dto.role }),
        updated_by: dto.updatedBy,
        updated_at: new Date(),
      },
    });

    return this.toResponseDto(updatedUser);
  }

  // Change user password - validate current password, hash new password
  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!this.verifyPassword(dto.currentPassword, user.password)) {
      throw new BadRequestException("Current password is incorrect");
    }

    await this.prisma.users.update({
      where: { id },
      data: {
        password: this.hashPassword(dto.newPassword),
        updated_by: dto.updatedBy,
        updated_at: new Date(),
      },
    });

    return { message: "Password changed successfully" };
  }

  // Deactivate user - validate existence, set isActive to false
  async deactivate(id: string, updatedBy: string): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        is_active: false,
        updated_by: updatedBy,
        updated_at: new Date(),
      },
    });

    return this.toResponseDto(updatedUser);
  }

  // Activate user - validate existence, set isActive to true
  async activate(id: string, updatedBy: string): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        is_active: true,
        updated_by: updatedBy,
        updated_at: new Date(),
      },
    });

    return this.toResponseDto(updatedUser);
  }
}

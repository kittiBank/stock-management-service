// Stores Service - Business logic for managing stores
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../prisma";
import {
  CreateStoreDto,
  UpdateStoreDto,
  QueryStoreDto,
  StoreResponseDto,
} from "./dto";

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponseDto(store: any): StoreResponseDto {
    return {
      id: store.id,
      code: store.code,
      nameTh: store.name_th,
      nameEn: store.name_en,
      type: store.type,
      address: store.address,
      isActive: store.is_active,
      createdBy: store.created_by,
      createdAt: store.created_at,
      updatedBy: store.updated_by,
      updatedAt: store.updated_at,
    };
  }

  // Create store - validate unique code, set createdBy and timestamps
  async create(dto: CreateStoreDto): Promise<StoreResponseDto> {
    // Validate required fields
    if (!dto.code) {
      throw new BadRequestException("Store code is required");
    }
    if (!dto.nameTh) {
      throw new BadRequestException("Store name (Thai) is required");
    }
    if (!dto.nameEn) {
      throw new BadRequestException("Store name (English) is required");
    }
    if (!dto.type) {
      throw new BadRequestException("Store type is required");
    }
    if (!dto.createdBy) {
      throw new BadRequestException("Created by is required");
    }

    try {
      const existingStore = await this.prisma.stores.findUnique({
        where: { code: dto.code },
      });

      if (existingStore) {
        throw new ConflictException("Store code already exists");
      }

      const now = new Date();
      const store = await this.prisma.stores.create({
        data: {
          code: dto.code,
          name_th: dto.nameTh,
          name_en: dto.nameEn,
          type: dto.type,
          address: dto.address || null,
          is_active: true,
          created_by: dto.createdBy,
          created_at: now,
          updated_by: dto.createdBy,
          updated_at: now,
        },
      });

      return this.toResponseDto(store);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (
        error instanceof Error &&
        "code" in error &&
        (error as any).code === "P2002"
      ) {
        throw new ConflictException("Store code already exists");
      }
      throw new InternalServerErrorException("Failed to create store");
    }
  }

  // Find all stores with optional filters and pagination
  async findAll(
    query: QueryStoreDto,
  ): Promise<{ data: StoreResponseDto[]; total: number }> {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.search) {
        where.OR = [
          { code: { contains: query.search, mode: "insensitive" } },
          { name_th: { contains: query.search, mode: "insensitive" } },
          { name_en: { contains: query.search, mode: "insensitive" } },
        ];
      }

      if (query.type) {
        where.type = query.type;
      }

      if (query.isActive !== undefined) {
        where.is_active = query.isActive;
      }

      const [stores, total] = await Promise.all([
        this.prisma.stores.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.stores.count({ where }),
      ]);

      return {
        data: stores.map((store) => this.toResponseDto(store)),
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch stores");
    }
  }

  // Find a store by ID
  async findOne(id: string): Promise<StoreResponseDto> {
    if (!id) {
      throw new BadRequestException("Store ID is required");
    }

    try {
      const store = await this.prisma.stores.findUnique({
        where: { id },
      });

      if (!store) {
        throw new NotFoundException("Store not found");
      }

      return this.toResponseDto(store);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch store");
    }
  }

  async findByCode(code: string): Promise<StoreResponseDto> {
    if (!code) {
      throw new BadRequestException("Store code is required");
    }

    try {
      const store = await this.prisma.stores.findUnique({
        where: { code },
      });

      if (!store) {
        throw new NotFoundException("Store not found");
      }

      return this.toResponseDto(store);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch store");
    }
  }

  async update(id: string, dto: UpdateStoreDto): Promise<StoreResponseDto> {
    if (!id) {
      throw new BadRequestException("Store ID is required");
    }
    if (!dto.updatedBy) {
      throw new BadRequestException("Updated by is required");
    }

    try {
      const store = await this.prisma.stores.findUnique({
        where: { id },
      });

      if (!store) {
        throw new NotFoundException("Store not found");
      }

      const updatedStore = await this.prisma.stores.update({
        where: { id },
        data: {
          ...(dto.nameTh && { name_th: dto.nameTh }),
          ...(dto.nameEn && { name_en: dto.nameEn }),
          ...(dto.type && { type: dto.type }),
          ...(dto.address !== undefined && { address: dto.address }),
          updated_by: dto.updatedBy,
          updated_at: new Date(),
        },
      });

      return this.toResponseDto(updatedStore);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to update store");
    }
  }

  // Inactivate store - set isActive to false, update updatedBy and timestamps
  async deactivate(id: string, updatedBy: string): Promise<StoreResponseDto> {
    if (!id) {
      throw new BadRequestException("Store ID is required");
    }
    if (!updatedBy) {
      throw new BadRequestException("Updated by is required");
    }

    try {
      const store = await this.prisma.stores.findUnique({
        where: { id },
      });

      if (!store) {
        throw new NotFoundException("Store not found");
      }

      const updatedStore = await this.prisma.stores.update({
        where: { id },
        data: {
          is_active: false,
          updated_by: updatedBy,
          updated_at: new Date(),
        },
      });

      return this.toResponseDto(updatedStore);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to deactivate store");
    }
  }

  // Activate store - set isActive to true, update updatedBy and timestamps
  async activate(id: string, updatedBy: string): Promise<StoreResponseDto> {
    if (!id) {
      throw new BadRequestException("Store ID is required");
    }
    if (!updatedBy) {
      throw new BadRequestException("Updated by is required");
    }

    try {
      const store = await this.prisma.stores.findUnique({
        where: { id },
      });

      if (!store) {
        throw new NotFoundException("Store not found");
      }

      const updatedStore = await this.prisma.stores.update({
        where: { id },
        data: {
          is_active: true,
          updated_by: updatedBy,
          updated_at: new Date(),
        },
      });

      return this.toResponseDto(updatedStore);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to activate store");
    }
  }
}

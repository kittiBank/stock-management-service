// Stores Controller - API endpoints for managing stores
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { StoresService } from "./stores.service";
import {
  CreateStoreDto,
  UpdateStoreDto,
  QueryStoreDto,
  StoreResponseDto,
} from "./dto";

@ApiTags("stores")
@Controller("stores")
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new store",
    description: "Create a new store/warehouse/branch",
  })
  @ApiResponse({
    status: 201,
    description: "Store created successfully",
    type: StoreResponseDto,
  })
  @ApiResponse({ status: 409, description: "Store code already exists" })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all stores",
    description: "Get list of stores with pagination and filters",
  })
  @ApiResponse({ status: 200, description: "List of stores" })
  findAll(@Query() query: QueryStoreDto) {
    return this.storesService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get store by ID",
    description: "Get store details by UUID",
  })
  @ApiParam({ name: "id", description: "Store UUID" })
  @ApiResponse({
    status: 200,
    description: "Store found",
    type: StoreResponseDto,
  })
  @ApiResponse({ status: 404, description: "Store not found" })
  findOne(@Param("id") id: string) {
    return this.storesService.findOne(id);
  }

  @Get("code/:code")
  @ApiOperation({
    summary: "Get store by code",
    description: "Get store details by unique code",
  })
  @ApiParam({ name: "code", description: "Store code (e.g., WH001)" })
  @ApiResponse({
    status: 200,
    description: "Store found",
    type: StoreResponseDto,
  })
  @ApiResponse({ status: 404, description: "Store not found" })
  findByCode(@Param("code") code: string) {
    return this.storesService.findByCode(code);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update store",
    description: "Update store information",
  })
  @ApiParam({ name: "id", description: "Store UUID" })
  @ApiResponse({
    status: 200,
    description: "Store updated",
    type: StoreResponseDto,
  })
  @ApiResponse({ status: 404, description: "Store not found" })
  update(@Param("id") id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Patch(":id/deactivate")
  @ApiOperation({
    summary: "Deactivate store",
    description: "Set store status to inactive (soft delete)",
  })
  @ApiParam({ name: "id", description: "Store UUID" })
  @ApiBody({
    schema: { properties: { updatedBy: { type: "string", example: "admin" } } },
  })
  @ApiResponse({
    status: 200,
    description: "Store deactivated",
    type: StoreResponseDto,
  })
  @ApiResponse({ status: 404, description: "Store not found" })
  deactivate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.storesService.deactivate(id, updatedBy);
  }

  @Patch(":id/activate")
  @ApiOperation({
    summary: "Activate store",
    description: "Set store status to active",
  })
  @ApiParam({ name: "id", description: "Store UUID" })
  @ApiBody({
    schema: { properties: { updatedBy: { type: "string", example: "admin" } } },
  })
  @ApiResponse({
    status: 200,
    description: "Store activated",
    type: StoreResponseDto,
  })
  @ApiResponse({ status: 404, description: "Store not found" })
  activate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.storesService.activate(id, updatedBy);
  }
}

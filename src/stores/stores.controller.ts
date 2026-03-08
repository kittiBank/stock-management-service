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
import { StoresService } from "./stores.service";
import { CreateStoreDto, UpdateStoreDto, QueryStoreDto } from "./dto";

@Controller("stores")
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  findAll(@Query() query: QueryStoreDto) {
    return this.storesService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.storesService.findOne(id);
  }

  @Get("code/:code")
  findByCode(@Param("code") code: string) {
    return this.storesService.findByCode(code);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Patch(":id/deactivate")
  deactivate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.storesService.deactivate(id, updatedBy);
  }

  @Patch(":id/activate")
  activate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.storesService.activate(id, updatedBy);
  }
}

// Users controller - API endpoints for user management
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
import { UsersService } from "./users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  QueryUserDto,
} from "./dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(":id/change-password")
  changePassword(
    @Param("id") id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Patch(":id/deactivate")
  deactivate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.usersService.deactivate(id, updatedBy);
  }

  @Patch(":id/activate")
  activate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.usersService.activate(id, updatedBy);
  }
}

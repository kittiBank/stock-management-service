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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  QueryUserDto,
  UserResponseDto,
} from "./dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new user",
    description: "Create a new user with hashed password",
  })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: "Username already exists" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all users",
    description: "Get list of users with pagination and filters",
  })
  @ApiResponse({ status: 200, description: "List of users" })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get user by ID",
    description: "Get user details by UUID",
  })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update user",
    description: "Update user information (except password)",
  })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiResponse({
    status: 200,
    description: "User updated",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(":id/change-password")
  @ApiOperation({
    summary: "Change password",
    description: "Change user password with current password verification",
  })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 400, description: "Current password is incorrect" })
  @ApiResponse({ status: 404, description: "User not found" })
  changePassword(
    @Param("id") id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Patch(":id/deactivate")
  @ApiOperation({
    summary: "Deactivate user",
    description: "Set user status to inactive (soft delete)",
  })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiBody({
    schema: { properties: { updatedBy: { type: "string", example: "admin" } } },
  })
  @ApiResponse({
    status: 200,
    description: "User deactivated",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  deactivate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.usersService.deactivate(id, updatedBy);
  }

  @Patch(":id/activate")
  @ApiOperation({
    summary: "Activate user",
    description: "Set user status to active",
  })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiBody({
    schema: { properties: { updatedBy: { type: "string", example: "admin" } } },
  })
  @ApiResponse({
    status: 200,
    description: "User activated",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  activate(@Param("id") id: string, @Body("updatedBy") updatedBy: string) {
    return this.usersService.activate(id, updatedBy);
  }
}

// Import all modules and controllers
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma";
import { UsersModule } from "./users";
import { StoresModule } from "./stores";

@Module({
  imports: [PrismaModule, UsersModule, StoresModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

// Swagger Configuration - API Documentation Setup
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Stock Management API")
    .setDescription("API documentation for Stock Management Service")
    .setVersion("1.0")
    .addTag("users", "User management endpoints")
    .addTag("stores", "Store management endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
}

import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('SmartPreço API')
    .setDescription(
      'SmartPreço API é uma API RESTful que fornece informações sobre mercados, produtos e seus preços.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
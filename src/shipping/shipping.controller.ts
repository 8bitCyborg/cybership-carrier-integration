// src/shipping/shipping.controller.ts
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { RateRequestDto } from './dto/rateRequest.dto';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) { }

  @Post('rates')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getRates(@Body() rateRequestDto: RateRequestDto) {
    return this.shippingService.getRatesByCarrier(rateRequestDto);
  };
};

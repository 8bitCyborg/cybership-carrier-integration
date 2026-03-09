import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { UpsModule } from '../carriers/ups/ups.module';

@Module({
  imports: [UpsModule],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule { }

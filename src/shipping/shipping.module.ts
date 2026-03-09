import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { UpsModule } from '../carriers/ups/ups.module';
import { FedexModule } from '../carriers/fedex/fedex.module';

@Module({
  imports: [UpsModule, FedexModule],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule { }

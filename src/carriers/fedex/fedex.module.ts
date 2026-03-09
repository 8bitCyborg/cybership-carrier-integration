import { Module } from '@nestjs/common';
import { FedexService } from './fedex.service';

@Module({
  controllers: [],
  providers: [FedexService],
  exports: [FedexService]
})
export class FedexModule { }

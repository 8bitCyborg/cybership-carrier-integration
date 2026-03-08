import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UpsService } from './ups.service';
import { UpsAuthService } from './ups.auth.service';
import { UpsMapper } from './ups.mapper';

@Module({
  imports: [HttpModule],
  providers: [UpsService, UpsAuthService, UpsMapper],
  controllers: [],
  exports: [UpsService],
})
export class UpsModule { }

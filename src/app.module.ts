import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpsModule } from './carriers/ups/ups.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UpsModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // using nestjs in-memory cache for now. Redis would be better in production.
    }),
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

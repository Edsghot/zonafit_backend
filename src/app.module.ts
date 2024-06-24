import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modulos/user/user.module';
import { ClientModule } from './modulos/client/client.module';
import { MembershipModule } from './modulos/membership/membership.module';
import { PaymentModule } from './modulos/payment/payment.module';
import { ProductModule } from './modulos/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { FreezingDayModule } from './modulos/freezing-day/freezing-day.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'ccontrolz.com',
    port: 3306,
    username: 'nibcqvah_edsghot',
    password: 'Repro123.',
    database: 'nibcqvah_zonaFit',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
}), UserModule, ClientModule, MembershipModule, PaymentModule, ProductModule, FreezingDayModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}

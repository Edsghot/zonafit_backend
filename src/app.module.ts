import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modulos/user/user.module';
import { ClientModule } from './modulos/client/client.module';
import { MembershipModule } from './modulos/membership/membership.module';
import { PaymentModule } from './modulos/payment/payment.module';
import { ProductModule } from './modulos/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { FreezingDayModule } from './modulos/freezing-day/freezing-day.module';
import { AttendanceModule } from './modulos/attendance/attendance.module';
import { CloudinaryModule } from './services/cloudinary/cloudinary.module';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { VaucherModule } from './modulos/vaucher/vaucher.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'jhedgost.com',
    port: 3306,
    username: 'dbjhfjuv_edsghot',
    password: 'Repro321.',
    database: 'dbjhfjuv_zonafit',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
}), UserModule, ClientModule, MembershipModule, PaymentModule, ProductModule, FreezingDayModule, AttendanceModule,CloudinaryModule,VaucherModule ],
  controllers: [],
  providers: [CloudinaryService],
})
export class AppModule {}

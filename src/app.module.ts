import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modulos/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'ccontrolz.com',
    port: 3306,
    username: 'nibcqvah_edsghot',
    password: 'Repro123.',
    database: 'nibcqvah_zonaFit',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
}), UserModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}

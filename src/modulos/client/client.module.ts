import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientEntity } from 'src/entity/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity])
  ],
  providers: [ClientService],
  controllers: [ClientController]
})
export class ClientModule {}

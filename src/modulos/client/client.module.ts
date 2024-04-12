import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientEntity } from 'src/entity/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipEntity } from 'src/entity/membership.entity';
import { PaymentEntity } from 'src/entity/Payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),TypeOrmModule.forFeature([MembershipEntity]),TypeOrmModule.forFeature([PaymentEntity])
  ],
  providers: [ClientService],
  controllers: [ClientController]
})
export class ClientModule {}

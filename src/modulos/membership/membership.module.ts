import { Module } from '@nestjs/common';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipEntity } from 'src/entity/membership.entity';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { UserEntity } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),TypeOrmModule.forFeature([MembershipEntity]),TypeOrmModule.forFeature([PaymentEntity])
  ],
  controllers: [MembershipController],
  providers: [MembershipService]
})
export class MembershipModule {}

import { Module } from '@nestjs/common';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { ClientEntity } from 'src/entity/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),TypeOrmModule.forFeature([MembershipEntity]),TypeOrmModule.forFeature([ClientEntity])
  ],
  controllers: [MembershipController],
  providers: [MembershipService]
})
export class MembershipModule {}

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from 'src/dto/membership/createMembreship.dto';
import { UpdateMembreshipDto } from 'src/dto/membership/updateMembreshio.dto';

@Controller('api/membership')
export class MembershipController {
    constructor(private readonly membershipService: MembershipService) {}

    @Post()
    async create(@Body() createMembershipDto: CreateMembershipDto) {
      return await this.membershipService.createMembership(createMembershipDto);
    }
  
    @Get()
    async findAll() {
      return await this.membershipService.findAllMemberships();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number) {
      return await this.membershipService.findMembershipById(id);
    }
  
    @Put('update')
    async update( @Body() updateMembershipDto: UpdateMembreshipDto) {
      return await this.membershipService.updateMembership(updateMembershipDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number) {
      return await this.membershipService.deleteMembership(id);
    }
}

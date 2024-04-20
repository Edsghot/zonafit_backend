import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMembershipDto } from 'src/dto/membership/createMembreship.dto';
import { UpdateMembreshipDto } from 'src/dto/membership/updateMembreshio.dto';
import { ClientEntity } from 'src/entity/client.entity';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { CommandSucceededEvent, Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createMembership(dto: CreateMembershipDto) {
    try {
      let membership = new MembershipEntity();
      const user = await this.userRepository.findOne({
        where: { IdUser: dto.UserId },
      });
      if (!user) {
        return { msg: 'error no se encontro el usuario', success: false };
      }

      membership.User = user;
      const client = await this.clientRepository.findOne({
        where: { IdClient: dto.ClientId },
      });
      if (!client) {
        return { msg: 'error no se encontro el cliente', success: false };
      }
      membership.Client = client;
      membership.StartDate = dto.StartDate;
      membership.EndDate = dto.EndDate;
      membership.Price = dto.Price;
      membership.discount = dto.Discount;
      membership.Type = dto.Type;
      membership.Observation = dto.Observation;
      await this.membershipRepository.save(membership);

      return { msg: 'se inserto correctamente', success: true };
    } catch (e) {
      return { msg: 'error al insertar', sucess: false, detailMsg: e };
    }
  }

  async findAllMemberships() {
    try{
        var membership = await this.membershipRepository.find();
        return {msg: "lista de membresias ", success: true, data: membership}
    }catch(e){
        return {msg: "error al listar ", success: false, detailMsg: e,data: null}

    }
  }

  async findMembershipById(id: number) {
    const membership = await this.membershipRepository.findOne({
      where: { IdMembership: id },
    });
    if (!membership) {
        return {msg: "no se encontro la membresia", success: false,data: null}
    }
    return {msg: "no se encontro la membresia", success: true,data: membership}
  }

  async updateMembership(
    updateDto: UpdateMembreshipDto,
  ){
    try{
        let membership = await this.findMembershipById(updateDto.IdMembreship);
        membership.data.StartDate = updateDto.StartDate;
        membership.data.EndDate = updateDto.EndDate;
        membership.data.Price = updateDto.Price;
        membership.data.discount = updateDto.Discount;
        membership.data.Type = updateDto.Type;
        membership.data.Observation = updateDto.Observation;
        await this.membershipRepository.save(membership.data);
    
         await this.membershipRepository.save(membership.data);
        return  {msg: "se actualizo correctamente", success: true}
    }catch(e){
        return {msg: "error al actualizar", success: false,detailMsg: e}
    }
  
  }

  async deleteMembership(id: number) {
    const result = await this.membershipRepository.delete(id);
    if (result.affected === 0) {
      return {msg: "error al eliminar ", success: false}
    }

    return {msg: "Se elimino correctamente", success: false}
  }
}

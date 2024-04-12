import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from 'src/dto/clientDto/CreateClientDto.dto';
import { ClientEntity } from 'src/entity/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
    constructor( @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>){}

    async insertClient(request: CreateClientDto) {
        try {
            // Create a new client entity using data from the DTO
            const newClient = new ClientEntity();
            newClient.Code = '121as';
            newClient.Username = request.username;
            newClient.FirstName = request.firstName;
            newClient.LastName = request.lastName;
            newClient.PhoneNumber = request.phoneNumber;
            newClient.Document = request.document;
            newClient.DocumentType = request.documentType;
            newClient.MaritalStatus = request.maritalStatus;
            newClient.Gender = request.gender;
            newClient.Address = request.address;
            newClient.Whatsapp = request.whatsapp;
            newClient.Email = request.email;
    
            // Save the new client entity to the database
            await this.clientRepository.save(newClient);
    
            return { msg: 'Client inserted successfully', success: true };
        } catch (error) {
            return { msg: 'Error: ', detailMsg: error, success: false };
        }
    }

    async getAllClients() {
        const clients = await this.clientRepository.find();
        return { msg: 'Clients found', success: true, data: clients };
    }

    async getClientById(id: number) {
        const client = await this.clientRepository.findOne({where: {IdClient:id}});
        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return { msg: 'Client found', success: true, data: client };
    }

    async getClientByDni(dni: string) {
        const client = await this.clientRepository.findOne({ where: { Document: dni } });
        if (!client) {
            throw new NotFoundException(`Client with DNI ${dni} not found`);
        }
        return { msg: 'Client found', success: true, data: client };
    }

    async deleteClient(id: number) {
        const result = await this.clientRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return { msg: 'Client deleted successfully', success: true };
    }

    async updateClient(id: number, updateData: CreateClientDto) {
        const client = await this.getClientById(id);
        Object.assign(client.data, updateData);
        await this.clientRepository.save(client.data);
        return { msg: 'Client updated successfully', success: true, data: client.data };
    }
    
}

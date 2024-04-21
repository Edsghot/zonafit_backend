import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from 'src/dto/clientDto/CreateClientDto.dto';
import { ClientEntity } from 'src/entity/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async insertClient(request: CreateClientDto) {
    try {
        // Crear una nueva entidad de cliente utilizando los datos del DTO
        const newClient = new ClientEntity();
        newClient.Code = '121as';
        newClient.Username = request.UserName;
        newClient.FirstName = request.FirstName;
        newClient.LastName = request.LastName;
        newClient.PhoneNumber = request.PhoneNumber;
        newClient.Document = request.document;
        newClient.DocumentType = request.DocumentType;
        newClient.MaritalStatus = request.MaritalStatus;
        newClient.Gender = request.Gender;
        newClient.Address = request.Address;
        newClient.Whatsapp = request.Whatsapp;
        newClient.Mail = request.Mail;
        newClient.BirthDate = request.BirthDate;
        newClient.Note = request.Note;
        newClient.Image = request.Image;

        // Guardar la nueva entidad de cliente en la base de datos
        await this.clientRepository.save(newClient);

        return { msg: 'Client inserted successfully', success: true };
    } catch (error) {
        console.error('Failed to insert client:', error);
        return { msg: 'Failed to insert client', detailMsg: error, success: false };
    }
}

async getAllClients() {
    try {
        const clients = await this.clientRepository.find();
        return { msg: 'Clients found', success: true, data: clients };
    } catch (error) {
        console.error('Failed to get clients:', error);
        return { msg: 'Failed to get clients', detailMsg: error, success: false };
    }
}

async getClientById(id: number) {
    try {
        const client = await this.clientRepository.findOne({ where: { IdClient: id } });
        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return { msg: 'Client found', success: true, data: client };
    } catch (error) {
        console.error('Failed to get client by ID:', error);
        return { msg: 'Failed to get client by ID', detailMsg: error, success: false };
    }
}

async getClientByDni(dni: string) {
    try {
        const client = await this.clientRepository.findOne({ where: { Document: dni } });
        if (!client) {
            throw new NotFoundException(`Client with DNI ${dni} not found`);
        }
        return { msg: 'Client found', success: true, data: client };
    } catch (error) {
        console.error('Failed to get client by DNI:', error);
        return { msg: 'Failed to get client by DNI', detailMsg: error, success: false };
    }
}

async deleteClient(id: number) {
    try {
        const result = await this.clientRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return { msg: 'Client deleted successfully', success: true };
    } catch (error) {
        console.error('Failed to delete client:', error);
        return { msg: 'Failed to delete client', detailMsg: error, success: false };
    }
}

async updateClient(id: number, request: CreateClientDto) {
    try {
        const client = await this.clientRepository.findOne({ where: { IdClient: id } });
        if (!client) {
            return { msg: 'Client not found', success: false };
        }

        client.Username = request.UserName;
        client.FirstName = request.FirstName;
        client.LastName = request.LastName;
        client.PhoneNumber = request.PhoneNumber;
        client.Document = request.document;
        client.DocumentType = request.DocumentType;
        client.MaritalStatus = request.MaritalStatus;
        client.Gender = request.Gender;
        client.Address = request.Address;
        client.Whatsapp = request.Whatsapp;
        client.Mail = request.Mail;
        client.BirthDate = request.BirthDate;

        await this.clientRepository.save(client);

        return {
            msg: 'Client updated successfully',
            success: true,
            data: client,
        };
    } catch (error) {
        console.error('Failed to update client:', error);
        return { msg: 'Failed to update client', detailMsg: error, success: false };
    }
}

}

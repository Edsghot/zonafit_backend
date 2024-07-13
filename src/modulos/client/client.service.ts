import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from 'src/dto/clientDto/CreateClientDto.dto';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';
import { ClientEntity } from 'src/entity/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async getMaxClientCode(): Promise<number> {
    const result = await this.clientRepository.query('SELECT MAX(Code) as maxCode FROM Client');
    const maxCodeClient = result[0]?.maxCode;

    // Si no hay un maxCodeClient, establece 2000 como el valor inicial
    return maxCodeClient !== null && maxCodeClient !== undefined ? parseInt(maxCodeClient, 10) : 2000;
  }
  async insertClient(request: CreateClientDto) {
    try {
        // Crear una nueva entidad de cliente utilizando los datos del DTO
        const newClient = new ClientEntity();

        const maxCode = await this.getMaxClientCode();
        newClient.Code = maxCode + 1;
        newClient.FirstName = request.FirstName;
        newClient.LastName = request.LastName;
        newClient.PhoneNumber = request.PhoneNumber;
        newClient.Document = request.Document;
        newClient.DocumentType = request.DocumentType;
        newClient.MaritalStatus = request.MaritalStatus;
        newClient.Gender = request.Gender;
        newClient.Address = request.Address;
        newClient.Whatsapp = request.Whatsapp;
        newClient.Mail = request.Mail;
        newClient.BirthDate = request.BirthDate;
        newClient.Note = request.Note;
        newClient.Image = request.Image;
        newClient.Created = new Date();

        // Guardar la nueva entidad de cliente en la base de datos
        await this.clientRepository.save(newClient);

        return { msg: 'Client inserted successfully', success: true };
    } catch (error) {
        console.error('Failed to insert client:', error);
        return { msg: 'Failed to insert client', detailMsg: error, success: false };
    }
}

async GetClientDue(){
    const clients = await this.clientRepository.query("SELECT Client.Code, CONCAT(Client.FirstName, ' ', Client.LastName) AS Apellido, Payment.StartDate, Payment.EndDate, Payment.Due FROM Client INNER JOIN Payment ON Client.IdClient = Payment.clientIdClient WHERE Payment.Due > 0;");
    if(!clients || clients.length == 0){
        return {msg:"No se encontraron clientes deudores", success: false}
    }

    return {msg:"Lista de deudores", success: true, data: clients}
}

async getClientByCode(code: number){
    const client = await this.clientRepository.findOne({
      where: { Code: code },
      relations: ['Payment', 'Attendance']
    });

    if (!client) {
        return { msg: 'No se encontro clientes', success: true, data: null };
    }

    return { msg: 'lista de clientes', success: true, data: client };
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

async getClientCountByMonth() {
    try {
      const clientCounts = await this.clientRepository
        .query("SELECT DATE_FORMAT(Created, '%Y-%m') AS month, COUNT(IdClient) AS count FROM Client GROUP BY DATE_FORMAT(Created, '%Y-%m') ORDER BY month ASC;")

      return {
        msg: "List of client counts by month",
        success: true,
        data: clientCounts,
      };
    } catch (error) {
      // Manejo de errores apropiado
      console.error('Error fetching client counts by month:', error);
      throw error;
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

        client.FirstName = request.FirstName;
        client.LastName = request.LastName;
        client.PhoneNumber = request.PhoneNumber;
        client.Document = request.Document;
        client.DocumentType = request.DocumentType;
        client.MaritalStatus = request.MaritalStatus;
        client.Gender = request.Gender;
        client.Address = request.Address;
        client.Whatsapp = request.Whatsapp;
        client.Mail = request.Mail;
        client.BirthDate = request.BirthDate;
        client.Note = request.Note;
        client.Image = request.Image;

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

async getClientByDateRange(request:DateRangeDto ){
    try{
        const data = await this.clientRepository.query(
            `CALL getClientByDateRange('${request.StartDate}', '${request.EndDate}')`,
          );
          return {
            msg: 'Lista de clientes completa',
            data: data[0],
            success: true,
          };
    }catch(error){
        console.error('Error al recuperar todos los clientes:', error);
        return {
            msg: 'Error al recuperar todos los clientes',
            detailMsg: error.message,
            success: false,
      };
    }
}
}

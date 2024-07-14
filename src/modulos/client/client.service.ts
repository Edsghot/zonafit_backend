import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from 'src/dto/clientDto/CreateClientDto.dto';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';
import { ClientEntity } from 'src/entity/client.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

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
        newClient.Created = moment.tz('America/Lima').toDate();;

        // Guardar la nueva entidad de cliente en la base de datos
        await this.clientRepository.save(newClient);

        return { msg: 'Cliente insertado correctamente', success: true };
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        return { msg: 'Error al insertar cliente', detailMsg: error, success: false };
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
        return { msg: 'Clientes encontrados', success: true, data: clients };
    } catch (error) {
        console.error('Error al conseguir clientes:', error);
        return { msg: 'Error al conseguir clientes', detailMsg: error, success: false };
    }
}

async getClientCountByMonth() {
    try {
      const clientCounts = await this.clientRepository
        .query("SELECT DATE_FORMAT(Created, '%Y-%m') AS month, COUNT(IdClient) AS count FROM Client GROUP BY DATE_FORMAT(Created, '%Y-%m') ORDER BY month ASC;")

      return {
        msg: "Lista de recuentos de clientes por mes",
        success: true,
        data: clientCounts,
      };
    } catch (error) {
      // Manejo de errores apropiado
      console.error('Error en el recuento de clientes por mes:', error);
      throw error;
    }
  }

async getClientById(id: number) {
    try {
        const client = await this.clientRepository.findOne({ where: { IdClient: id } });
        if (!client) {
            throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return { msg: 'Cliente encontrado', success: true, data: client };
    } catch (error) {
        console.error('Error al obtener el cliente por ID:', error);
        return { msg: 'Error al obtener el cliente por ID', detailMsg: error, success: false };
    }
}

async getClientByDni(dni: string) {
    try {
        const client = await this.clientRepository.findOne({ where: { Document: dni } });
        if (!client) {
            throw new NotFoundException(`Cliente con DNI ${dni} no encontrado`);
        }
        return { msg: 'Cliente encontrado', success: true, data: client };
    } catch (error) {
        console.error('Fallo en la obtención de cliente por DNI:', error);
        return { msg: 'Fallo en la obtención de cliente por DNI', detailMsg: error, success: false };
    }
}

async deleteClient(id: number) {
    try {
        const result = await this.clientRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return { msg: 'Cliente eliminado correctamente', success: true };
    } catch (error) {
        console.error('Error al borrar cliente:', error);
        return { msg: 'Error al borrar cliente', detailMsg: error, success: false };
    }
}

async updateClient(id: number, request: CreateClientDto) {
    try {
        const client = await this.clientRepository.findOne({ where: { IdClient: id } });
        if (!client) {
            return { msg: 'Cliente no encontrado', success: false };
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
            msg: 'Cliente actualizado correctamente',
            success: true,
            data: client,
        };
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        return { msg: 'Error al actualizar el cliente', detailMsg: error, success: false };
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

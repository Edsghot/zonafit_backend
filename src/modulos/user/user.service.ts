import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/userDto/CreateUserDto.dto';
import { UpdateUserDto } from 'src/dto/userDto/UpdateUserDto.dto';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor( @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>){}

    async getMaxClientCode(): Promise<number> {
        const result = await this.userRepository.query('SELECT MAX(Code) as maxCode FROM User');
        const maxCodeClient = result[0]?.maxCode;
    
        // Si no hay un maxCodeClient, establece 2000 como el valor inicial
        return maxCodeClient !== null && maxCodeClient !== undefined ? parseInt(maxCodeClient, 10) : 5000;
      }

    async insertUser(request: CreateUserDto) {
      try {
        const maxCode = await this.getMaxClientCode();
          // Crear una nueva entidad de usuario utilizando los datos del DTO
          const newUser = this.userRepository.create({
              FirstName: request.FirstName,
              LastName: request.LastName,
              Password: request.Password,
              PhoneNumber: request.PhoneNumber,
              Dni: request.Dni,
              Code: maxCode+1,
              UserName: request.UserName,
              Access: true,
              RoleId: request.RoleId,
              Mail: request.Mail,
              BirthDate: request.BirthDate,
              Image: request.Image,
          });
  
          // Guardar la nueva entidad de usuario en la base de datos
          await this.userRepository.save(newUser);
  
          return { msg: 'User inserted successfully', success: true };
      } catch (error) {
          console.error('Failed to insert user:', error);
          return { msg: 'Failed to insert user', detailMsg: error, success: false };
      }
  }

  async updateUserId(request: UpdateUserDto) {
    try {
      // Obtener el usuario existente por su ID
      const userToUpdate = await this.userRepository.findOne({where:{IdUser: request.IdUser}});

      if (!userToUpdate) {
        return { msg: 'No se encontro el usuario', success: false };
      }

      // Actualizar los campos del usuario con los datos del DTO
      userToUpdate.FirstName = request.FirstName;
      userToUpdate.LastName = request.LastName;
      userToUpdate.Password = request.Password;
      userToUpdate.PhoneNumber = request.PhoneNumber;
      userToUpdate.Dni = request.Dni;
      userToUpdate.UserName = request.UserName;
      userToUpdate.RoleId = request.RoleId;
      userToUpdate.Mail = request.Mail;
      userToUpdate.BirthDate = request.BirthDate;
      userToUpdate.Image = request.Image;
      userToUpdate.Access = request.Access;

      // Guardar los cambios en la base de datos
      await this.userRepository.save(userToUpdate);

      return { msg: 'User updated successfully', success: true };
    } catch (error) {
      console.error('Failed to update user:', error);
      return { msg: 'Failed to update user', detailMsg: error, success: false };
    }
  }
  
  async getAllUsers() {
    try {
        const users = await this.userRepository.find();
        return { data: users, msg: 'Success', success: true };
    } catch (error) {
        console.error('Failed to get users:', error);
        return { msg: 'Failed to get users', detailMsg: error, success: false };
    }
}
  
async deleteUser(userId: number) {
    try {
        await this.userRepository.delete(userId);
        return { msg: 'Success', success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { msg: 'Failed to delete user', detailMsg: error, success: false };
    }
}

async getUserById(userId: number) {
    try {
        const user = await this.userRepository.findOne({ where: { IdUser: userId } });
        if(!user){
            return { msg: 'no se encontro el usuario', success: false, data: null };
        }
        return { data: user, msg: 'Success', success: true };
    } catch (error) {
        console.error('Failed to get user by ID:', error);
        return { msg: 'Failed to get user', detailMsg: error, success: false };
    }
}

async login(username: string, password: string) {
    try {
        const user = await this.userRepository.findOne({ where: { UserName: username, Password: password } });

        
        if (!user || user.Password !== password || user.UserName !== username) {
            return { data: null, msg: 'Invalid username or password', success: false };
        }
        if (!user.Access) {
            return { data: null, msg: 'Usted no tiene acceso al sistema', success: false };
        }
        return { data: user, msg: 'Success', success: true };
    } catch (error) {
        console.error('Login failed:', error);
        return { msg: 'Login failed', detailMsg: error, success: false };
    }
}

  
}

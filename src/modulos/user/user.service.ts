import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/userDto/CreateUserDto.dto';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor( @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>){}


    async insertUser(request: CreateUserDto) {
      try {
          // Crear una nueva entidad de usuario utilizando los datos del DTO
          const newUser = this.userRepository.create({
              FirstName: request.FirstName,
              LastName: request.LastName,
              Password: request.Password,
              PhoneNumber: request.PhoneNumber,
              Dni: request.Dni,
              Code: 'as34',
              UserName: request.UserName,
              Access: request.Access,
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

        
        if (!user || user.Password !== password || !user.Access || user.UserName !== username) {
            return { data: null, msg: 'Invalid username or password', success: false };
        }

        return { data: user, msg: 'Success', success: true };
    } catch (error) {
        console.error('Login failed:', error);
        return { msg: 'Login failed', detailMsg: error, success: false };
    }
}

  
}

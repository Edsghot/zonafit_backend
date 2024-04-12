import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/userDto/CreateUserDto.dto';
import { UserEntity } from 'src/entity/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor( @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>){}

    async insertUser(request: CreateUserDto) {
        try {
          // Create a new user entity using data from the DTO
          const newUser = this.userRepository.create({
            FirstName: request.firstName,
            LastName: request.lastName,
            Password: request.password,
            PhoneNumber: request.phoneNumber,
            Dni: request.dni,
            Code: request.code,
            Username: request.username,
            Access: request.access,
            RoleId: request.roleId,
            Email: request.email,
          });
    
          // Save the new user entity to the database
          await this.userRepository.save(newUser);
    
          return { msg: 'User inserted successfully', success: true };
        } catch (error) {
          return { msg: 'Error: ', detailMsg: error, success: false };
        }
      }
      async getAllUsers(): Promise<{ data: UserEntity[], msg: string, success: boolean }> {
        try {
          const users = await this.userRepository.find();
          return { data: users, msg: 'Success', success: true };
        } catch (error) {
          throw new Error('Failed to get users');
        }
      }
    
      async deleteUser(userId: number): Promise<void> {
        try {
          await this.userRepository.delete(userId);
        } catch (error) {
          throw new Error('Failed to delete user');
        }
      }
    
      async getUserById(userId: number): Promise<{ data: UserEntity | undefined, msg: string, success: boolean }> {
        try {
          const user = await this.userRepository.findOne({where: {IdUser: userId}});
          return { data: user, msg: 'Success', success: true };
        } catch (error) {
          throw new Error('Failed to get user');
        }
      }
    
      async login(username: string, password: string): Promise<{ data: UserEntity | null, msg: string, success: boolean }> {
        try {
          const user = await this.userRepository.findOne({ where: { Username: username } });
          if (!user || user.Password !== password || !user.Access) {
            return { data: null, msg: 'Invalid username or password', success: false };
          }
    
          return { data: user, msg: 'Success', success: true };
        } catch (error) {
          throw new Error('Login failed');
        }
      }
}

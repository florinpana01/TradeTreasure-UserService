import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {log} from 'console';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';

// // Initialize Firebase Admin SDK with your private key
// const path = require('path');
// const serviceAccount = require(path.resolve(__dirname, '../../serviceAccountKey.json'));
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // Add other configurations if necessary
// });


@Injectable()
export class UserService {
    constructor(  
      @InjectRepository(User) private readonly userRepository: Repository<User>
    ){  
    }
    async all(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        //console.log(email);
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        return user;
      }

    async findRoleByEmail(email: string): Promise<string| null> {
        const user = await this.userRepository.findOne({where: {email}});
        if (!user) {
            throw new NotFoundException('User not found');
          }
          return user.role;
    }
    

    // async register(data): Promise<User> {
    //     const newUser = await this.userRepository.save(data);
    //     return newUser;
    //   }
    async register(data): Promise<User> {
        // Validate and set default role
        if(!data.role) {
            data.role='user';
        }
        if (data.role !== 'user') {
            throw new BadRequestException('Invalid or missing user role');
        }
        //this.validatePassword(data.password);

        const newUser = await this.userRepository.save({
            ...data,
            role: data.role || 'user', // Set default role to 'user' if not provided
        });
        return newUser;
    }
    
    // private validatePassword(password: string): void {
    //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
      
    //   if (!passwordRegex.test(password)) {
    //     throw new BadRequestException('Invalid password. It must have at least 12 characters, one lowercase letter, one uppercase letter, one number, and one special character.');
    //   }
    // }

    async findOne(condition: any): Promise<User> {
        return this.userRepository.findOne({where: condition});
    }

    async findOneBy(id: number): Promise<User> {
        console.log("received id: ", id);
        var response = await this.userRepository.findOneBy({id});
        console.log("response is: ", response);
        return this.userRepository.findOneBy({id});
    }

    async update(id: number, data): Promise<any>{
        return this.userRepository.update(id, data);
    }
    
    async delete(email: string): Promise<void> {
      const userToDelete = await this.findByEmail(email);
  
      if (!userToDelete) {
        throw new NotFoundException('User not found');
      }
  
      try {
        await this.userRepository.remove(userToDelete);
      } catch (error) {
        throw new InternalServerErrorException('Error deleting user');
      }
    }
    }

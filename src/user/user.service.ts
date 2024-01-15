import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        if (data.role !== 'user' && data.role !== 'admin') {
            throw new BadRequestException('Invalid or missing user role');
        }
        const newUser = await this.userRepository.save({
            ...data,
            role: data.role || 'user', // Set default role to 'user' if not provided
        });
        return newUser;
    }

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
    
    async delete(email: string, deleterEmail: string): Promise<any> {
        const userToDelete = await this.findByEmail(email);
        const userThatDeletes = await this.findByEmail(deleterEmail);
        console.log('User to delete:', userToDelete);
        console.log('Deleter email:', deleterEmail);
      
        if (userThatDeletes && userToDelete) {
          if (userThatDeletes.role !== 'admin') {
            throw new BadRequestException('You are not authorized to delete this user');
          }
        } else {
          throw new BadRequestException('Invalid data');
        }
      
        return this.userRepository.delete(email);
      }
    }

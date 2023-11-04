import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';

@Injectable()
export class UserService {
    // the connection to the database
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){  
    }
    async all(): Promise<User[]> {
        return this.userRepository.find();
    }

    async register(data): Promise<User>{
        return this.userRepository.save(data);
    }

    async findOne(condition: any): Promise<User> {
        return this.userRepository.findOne({where: condition});
    }

    async get(id: number): Promise<User> {
        return this.userRepository.findOneBy({id});
    }

    async update(id: number, data): Promise<any>{
        return this.userRepository.update(id, data);
    }
    
    async delete(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }
    }

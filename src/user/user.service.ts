import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {log} from 'console';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';

// Initialize Firebase Admin SDK with your private key
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../../serviceAccountKey.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add other configurations if necessary
});


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
    

    async register(data): Promise<User> {
        // Create user in your MySQL database
        const newUser = await this.userRepository.save(data);
    
        // Call the method to create user in Firebase
        //await this.createFirebaseUser(data.email, data.password);
    
        return newUser;
      }


    //   async createFirebaseUser(email: string, password: string): Promise<void> {
    //     try {
    //       // Initialize Firebase Admin SDK (Ensure it's initialized before using any Firebase services)
    //       if (!admin.apps.length) {
    //         admin.initializeApp({
    //           credential: admin.credential.cert(serviceAccount),
    //           // Add other configurations if necessary
    //         });
    //       }
      
    //       console.log('Creating Firebase user for email:', email);
      
    //       // Check if the user already exists in Firebase
    //       const userRecord = await admin.auth().getUserByEmail(email);
    //       if (userRecord) {
    //         console.log('Firebase user already exists:', userRecord.uid);
    //         // Handle accordingly, e.g., return an error or skip creating the user
    //       } else {
    //         // If not, create the user in Firebase
    //         await admin.auth().createUser({
    //           email,
    //           password,
    //         });
    //         console.log(`Firebase user created for email: ${email}`);
    //       }
    //     } catch (error) {
    //       console.error(`Error creating Firebase user: ${error}`);
    //     }
    //   }
      

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
    
    async delete(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }
    }

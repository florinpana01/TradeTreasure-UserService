import { Module } from '@nestjs/common';
import {User} from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {ClientsModule, Transport} from '@nestjs/microservices';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'Totamealand1983',
            database: 'tt-users',
            autoLoadEntities: true,
            synchronize: true,
          }),
          UserModule,
          TypeOrmModule.forFeature([User]),
          ClientsModule.register([{
            name: 'USER_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: ['amqps://pjfufoya:LuO22_OIV_SIcvDewsRCbu_nTAUooYvt@kangaroo.rmq.cloudamqp.com/pjfufoya'],
              queue: 'users_queue',
              queueOptions: {
                durable: false
              },
            },
          },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}

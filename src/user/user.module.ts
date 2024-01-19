import { Module } from '@nestjs/common';
import {User} from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {ClientsModule, Transport} from '@nestjs/microservices';

@Module({
    imports: [
          TypeOrmModule.forFeature([User]),
          ClientsModule.register([{
            name: 'PRODUCT_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: ['amqps://pjfufoya:LuO22_OIV_SIcvDewsRCbu_nTAUooYvt@kangaroo.rmq.cloudamqp.com/pjfufoya'],
              queue: 'products-queue-gateway',
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

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { FollowController } from './follow/follow.controller';
import { FollowService } from './follow/follow.service';
import { FollowModule } from './follow/follow.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      //host: '127.0.0.1',
      //port: 1234,
      port: 3306,
      username: 'root',
      password: 'Totamealand1983',
      //database: 'tradetreasure-users',
      database: 'tt-users',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

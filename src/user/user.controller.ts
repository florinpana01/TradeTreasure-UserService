import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put } from '@nestjs/common';
import {UserService} from './user.service';
import {ClientProxy, EventPattern} from '@nestjs/microservices';

@Controller('users')
export class UserController {

    constructor(private userService: UserService,
        @Inject('USER_SERVICE') private readonly client: ClientProxy,) {}

        @EventPattern('user_request_all')
        async all() {
            console.log('getting all users');
            return await this.userService.all();
        }
   
        @EventPattern('test')
        async hello() {
            console.log("test");
        }

        @EventPattern('user_created_gateway')
        async register(data) {
            console.log("user_created_gateway data", data);
            const newUser = await this.userService.register(data);
            return newUser;
        }

        @Get(':id')
        async get(@Param('id') id: number) {
            return this.userService.get(id);
        }

        @EventPattern('user_updated_gateway')
        async update(data) {
            console.log("post_updated_gateway", data);
            await this.userService.update(data.id, data);
            const user = await this.userService.get(data.id);
            console.log("user updated", user);
            this.client.emit('user_updated', user);
            return user;
        }

        @EventPattern('user_deleted_gateway')
        async delete(id) {
            console.log("user deleted id", id);
            this.userService.delete(id);
            this.client.emit('user_deleted', id);
            return HttpStatus.NO_CONTENT;
            
        }
}

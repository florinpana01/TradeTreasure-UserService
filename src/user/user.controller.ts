import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {UserService} from './user.service';
import {EventPattern} from '@nestjs/microservices';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}
    @Get()
    async all() {
        return this.userService.all();
    }

    // @EventPattern('test')
    // async hello(data: string) {
    //     console.log(data);
    // }

    @EventPattern('product_created')
    async helloNew(product: any){

    }

    @Post()
    async create(
        @Body('firstName') firstName: string,
        @Body('lastName') lastName: string,
        @Body('email') email: string,
        @Body('password') password: string,
        ) {
        return this.userService.create({
            firstName,
            lastName,
            email,
            password
        });
    }

    @Get(':id')
    async get(@Param('id') id: number){
        return this.userService.get(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body('firstName') firstName: string,
        @Body('lastName') lastName: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ){
        return this.userService.update(id, {
            firstName,
            lastName,
            email,
            password
        });
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}

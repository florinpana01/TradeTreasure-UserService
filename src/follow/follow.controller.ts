import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
    constructor(private followService: FollowService,
        @Inject('FOLLOW_SERVICE') private client: ClientProxy,
    ) {

    }

    
    @EventPattern('follow_created_gateway')
    async create(data) {
        console.log("follow_created_gateway data", data);
        const follow = await this.followService.create(data);
        this.client.emit('follow_created', follow);
        return follow;
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.followService.get(id);
    }

    @EventPattern('follow_updated_gateway')
    async update(data) {
        console.log("follow_updated_gateway", data);
        await this.followService.update(data.id, data);
        const follow = await this.followService.get(data.id);
        console.log("follow updated", follow);
        this.client.emit('follow_updated', follow);
        return follow;
    }


    @EventPattern('follow_deleted_gateway')
    async delete(id) {
        console.log("follow deleted id", id);
        this.followService.delete(id);
        this.client.emit('follow_deleted', id);
        return HttpStatus.NO_CONTENT;
        
    }
}

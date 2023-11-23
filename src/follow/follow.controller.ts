import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { FollowService } from './follow.service';

@Controller('follows')
export class FollowController {
    constructor(private followService: FollowService,
        @Inject('FOLLOW_SERVICE') private client: ClientProxy,
    ) {

    }

    @EventPattern('follow_request_all')
    async all() {
        console.log('getting all follows');
            return this.followService.all();
    }
    
    @EventPattern('follow_created_gateway')
    async create(data) {
        console.log("follow_created_gateway data", data);
        const follow = await this.followService.create(data);
        // this.client.emit('follow_created_gateway', follow);
        return follow;
    }

    @EventPattern('follow_request_single')
    async findOneBy(id: number) {
        console.log("getting requested follow, ", id);
        const requestedFollow = await this.followService.findOneBy(id);
        return requestedFollow;
    }

    // @EventPattern('follow_updated_gateway')
    // async update(data) {
    //     console.log("follow_updated_gateway", data);
    //     await this.followService.update(data.id, data);
    //     const follow = await this.followService.findOneBy(data.id);
    //     console.log("follow updated", follow);
    //     // this.client.emit('user_updated', user);
    //     return follow;
    // }


    @EventPattern('follow_deleted_gateway')
    async delete(id) {
        console.log("follow deleted id", id);
        this.followService.delete(id);
        // this.client.emit('follow_deleted_gateway', id);
        return HttpStatus.NO_CONTENT;
        
    }
}

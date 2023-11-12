import { HttpStatus } from '@nestjs/common';
import { Client, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';



describe('FollowController', () => {

  let controller: FollowController;

  const mockFollowService = {
    create: jest.fn().mockImplementation((data) => ({ id: Date.now(), ...data })),
    update: jest.fn().mockImplementation((id, data) => ({ ...data })),
    get: jest.fn().mockImplementation((id) => ({
      id: 1,
      followerId: 1,
      followedId: 2
    })),
    delete: jest.fn().mockImplementation((id) => (HttpStatus.NO_CONTENT))
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([
        {
          name: 'FOLLOW_SERVICE',
          transport: Transport.RMQ
        }
      ])],
      controllers: [FollowController],
      providers: [FollowService]
    }).overrideProvider(FollowService).useValue(mockFollowService).compile();
    controller = module.get<FollowController>(FollowController);

  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const data = {
      followerId: 1,
      followedId: 2
    }
    expect(await controller.create(data)).toEqual({
      id: expect.any(Number),
      ...data
    })
  })
});
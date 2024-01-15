import { HttpStatus } from '@nestjs/common';
import { Client, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';


describe('UserController', () => {

  let controller: UserController;

  const mockUserService = {
    register: jest.fn().mockImplementation((data) => ({ id: Date.now(), ...data })),
    update: jest.fn().mockImplementation((id, data) => ({ ...data })),
    get: jest.fn().mockImplementation((id) => ({
      id: 1,
      firstName: "first",
      lastName: "last",
      email: "email update",
      password: "pass update"
    })),
    delete: jest.fn().mockImplementation((id) => (HttpStatus.NO_CONTENT)),
    findOneBy: jest.fn().mockImplementation((id) => ({
      id,
      firstName: "first",
      lastName: "last",
      email: "email update",
      password: "pass update"
    })),
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([
        {
          name: 'USER_SERVICE',
          transport: Transport.RMQ
        }
      ])],
      controllers: [UserController],
      providers: [UserService]
    }).overrideProvider(UserService).useValue(mockUserService).compile();
    controller = module.get<UserController>(UserController);

  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const data = {
      firstName: "first",
      lastName: "test",
      email: "test@test.com",
      password: "password"
    }
    expect(await controller.register(data)).toEqual({
      id: expect.any(Number),
      ...data
    })
  })

  it('should update a user', async () => {
    const data = {
      id: 1,
      firstName: "first",
      lastName: "last",
      email: "email update",
      password: "pass update"
    }
    expect(await controller.update(data)).toEqual({
      ...data
    })
  })
  it('should delete a user', async () => {
    const userId = 1;
    const userRole = 'user'; // Provide the user's role here
    expect(await controller.delete({ id: userId, role: userRole })).toEqual(HttpStatus.NO_CONTENT);
  });  
  
});
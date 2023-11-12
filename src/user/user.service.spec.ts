import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";


describe('UserService', () => {
    let service: UserService;

    const mockUserRepository = {
        save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
        update: jest.fn().mockImplementation((id, data) => ({id, ...data})),
        find: jest.fn().mockImplementation(() => Promise.resolve([])),
        findOne: jest.fn().mockImplementation((id) => Promise.resolve({
            id: 1,
            firstName: "new",
            lastName: "new",
            email: "new@new.com",
            password: "password"
        }))
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, {
                provide: getRepositoryToken(User),
                useValue: mockUserRepository
            }],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new user', async () => {
        const data = {
            firstName: "test",
            lastName: "test",
            email: "test@test.nl",
            password: "password"
        }

        const savedUser = await service.register(data);
        expect(savedUser).toBeDefined();
    });
})

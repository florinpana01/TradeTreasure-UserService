import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Follow } from "./follow.entity";
import { FollowService } from "./follow.service";


describe('FollowService', () => {
    let service: FollowService;

    const mockFollowRepository = {
        save: jest.fn().mockImplementation((follow: Follow) => Promise.resolve(follow)),
        update: jest.fn().mockImplementation((id, data) => ({id, ...data})),
        find: jest.fn().mockImplementation(() => Promise.resolve([])),
        findOne: jest.fn().mockImplementation((id) => Promise.resolve({
            followerId: 1,
            followedId: 2,
        }))
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FollowService, {
                provide: getRepositoryToken(Follow),
                useValue: mockFollowRepository
            }],
        }).compile();

        service = module.get<FollowService>(FollowService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new follow', async () => {
        const data = {
            followerId: 1,
            followedId: 2,
        }

        const savedFollow = await service.create(data);
        expect(savedFollow).toBeDefined();
    });
})

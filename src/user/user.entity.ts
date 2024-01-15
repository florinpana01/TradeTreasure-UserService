import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default: 0})
    followers: number;
    
    @Column({
        type: "enum",
        enum: ["user", "admin"],
        default: "user"
    })
    role: string;
}
import type { Repository } from '@domaincrafters/domain';
import { User } from 'EcoPath/Domain/mod.ts';

export interface UserRepository extends Repository<User> {
    findAll(): Promise<User[]>;
}
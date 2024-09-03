import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsSelectByString, FindOptionsWhere, Repository } from 'typeorm';
import { encryptPassword } from 'src/helpers/encryption';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { httpStatusCodes } from 'src/utils/responseConfig';
import { CustomGraphQLException, GraphQLErrorCodes } from 'src/utils/graphqlErrorResponse';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      createUserInput.password = await encryptPassword(createUserInput.password);
      const user = this.userRepository.create(createUserInput);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new CustomGraphQLException("This email is already in use.", httpStatusCodes['Conflict'], GraphQLErrorCodes['CONFLICT']);
      }
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users: Awaited<Promise<User[]>> = await this.userRepository.find({});
      return users;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user: Awaited<Promise<User>> = await this.userRepository.findOne({
        where: {
          id
        }
      })
      if (!user) throw new CustomGraphQLException("This user does not exists.", httpStatusCodes['Not Found'], GraphQLErrorCodes['NOT_FOUND'])
      return user;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      if (updateUserInput.password) updateUserInput.password = await encryptPassword(updateUserInput.password);
      const user = await this.userRepository.update({
        id
      }, updateUserInput);

      if (user.affected === 0) throw new CustomGraphQLException("This user does not exists.", httpStatusCodes['Not Found'], GraphQLErrorCodes['NOT_FOUND'])

      const updatedUser = await this.findOne(id);
      return updatedUser;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.findOne(id);

      const deletedUser = await this.userRepository.softDelete({
        id
      });

      return user;
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }

  async findSingleUser(query: FindOptionsWhere<User>, projection?: FindOptionsSelectByString<User>): Promise<User> {
    try {
      const options: FindManyOptions<User> = {
        where: query
      };

      if (projection) options.select = projection;

      const user = await this.userRepository.find(options);

      if (!user || user?.length === 0) throw new CustomGraphQLException('This user does not exists.', httpStatusCodes['Not Found'], GraphQLErrorCodes['NOT_FOUND']);
      return user[0];
    } catch (error) {
      throw new CustomGraphQLException(error.message, error?.extensions?.status || httpStatusCodes['Bad Request'], error?.extensions?.code || GraphQLErrorCodes['BAD_USER_INPUT']);
    }
  }
}

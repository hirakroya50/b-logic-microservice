import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async findAll() {
    const allUser = await this.prismaService.user.findMany();
    return allUser;
  }
  async signUp(data: Prisma.UserCreateInput) {
    const { email, password, username, mobile } = data;
    try {
      const existingUser = await this.prismaService.user.findFirst({
        where: {
          OR: [{ email }, { username }, { mobile }],
        },
      });

      if (
        existingUser?.email === email ||
        existingUser?.username === username ||
        existingUser?.mobile === mobile
      ) {
        const field =
          existingUser.email === email
            ? 'email'
            : existingUser.username === username
              ? 'username'
              : 'mobile';

        throw new ConflictException(`${field} "${data[field]}" already in use`);
      }
      // Hash the password
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await this.prismaService.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      if (error?.response?.error === 'Conflict') {
        // Handle known request errors (like unique constraints)
        throw new ConflictException(error?.response?.message);
      } else {
        // Handle unexpected errors
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  async deleteUserByEmail(email: Prisma.UserCreateInput['email']) {
    try {
      await this.prismaService.user.delete({ where: { email } });
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    try {
      let updateUser = await this.prismaService.user.update({
        where: { id: Number(id) },
        data,
      });

      // console.log({ updateUser });

      return updateUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('User not found');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}

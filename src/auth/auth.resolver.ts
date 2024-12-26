import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/auth.model';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly userService: AuthService) {}
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  //CREATE / SIGNUP
  @Mutation(() => User)
  async signUp(
    @Args('email') email: string,
    @Args('username') username: string,
    @Args('mobile') mobile: string,
    @Args('password') password: string,
  ) {
    return this.userService.signUp({ email, username, mobile, password });
  }

  //DELETE
  @Mutation(() => Boolean)
  async deleteUser(@Args('email') email: string) {
    return this.userService.deleteUserByEmail(email);
  }

  //UPDATE
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('username', { nullable: true }) username?: string,
    @Args('mobile', { nullable: true }) mobile?: string,
  ) {
    return this.userService.updateUser(id, { username, mobile });
  }
}

import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  mobile?: string;

  @HideField()
  password: string;

  @Field()
  createdAt: Date;
}

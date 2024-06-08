import { createEnum } from "@/database/createEnum";
import { Enum } from "@/database/decorators";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { BaseEntity } from "@/database/baseEntity";
import { Field, ObjectType } from "@nestjs/graphql";

enum UserDocumentType {
  disability,
  physicalAptitude,
  minorAuthorization,
  others,
}

export const userDocumentType = createEnum(
  UserDocumentType,
  "UserDocumentType"
);

@ObjectType()
@Entity()
export class UserDocument extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  name?: string;

  @Field({ nullable: true })
  @Enum(userDocumentType)
  type: UserDocumentType;

  @Field({ nullable: true })
  @Property()
  file: string;

  @Field(() => User, { nullable: true })
  @ManyToOne()
  user: User;
}

import { BaseEntity } from "@/database/baseEntity";
import { Entity, OneToMany, OneToOne, Property, Ref } from "@mikro-orm/core";
import { UserDocument } from "./userDocument.entity";
import { UserInfo } from "./userInfo.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  fullName: string;

  @Field({ nullable: true })
  @Property()
  email: string;

  @Field({ nullable: true })
  @Property()
  document: string;

  @Field({ nullable: true })
  @Property()
  phone: string;

  @Field({ nullable: true })
  @Property()
  password: string;

  @Field({ nullable: true })
  @Property()
  confirmed: boolean;

  @Field(() => UserInfo, { nullable: true })
  @OneToOne()
  info?: Ref<UserInfo>;

  @Field(() => [UserDocument], { nullable: true })
  @OneToMany(() => UserDocument, (document) => document.user)
  documents?: UserDocument[];
}

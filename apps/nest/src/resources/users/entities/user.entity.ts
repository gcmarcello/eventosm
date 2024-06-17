import { BaseEntity } from "@/database/baseEntity";
import {
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
  Ref,
} from "@mikro-orm/core";
import { UserDocument } from "./userDocument.entity";
import { UserInfo } from "./userInfo.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { createEnum } from "@/database/createEnum";
import { Organization } from "@/resources/organizations/entities/organization.entity";

export enum Role {
  admin = "admin",
  user = "user",
}

export const role = createEnum(Role, "Role");

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  firstName: string;

  @Field({ nullable: true })
  @Property()
  lastName: string;

  @Property({ name: "fullName" })
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field({ nullable: true })
  @Property()
  email: string;

  @Field({ nullable: true })
  @Property()
  document: string;

  @Field({ nullable: true })
  @Property()
  phone: string;

  @Property()
  password: string;

  @Field(() => Role, { nullable: true })
  @Enum(role)
  role: Role;

  @Field({ nullable: true })
  @Property()
  confirmed: boolean;

  @Field(() => UserInfo, { nullable: true })
  @OneToOne()
  info?: Ref<UserInfo>;

  @Field(() => [UserDocument], { nullable: true })
  @OneToMany(() => UserDocument, (document) => document.user)
  documents?: UserDocument[];

  @Field(() => [Organization], { nullable: true })
  @OneToMany(() => Organization, (organization) => organization.owner)
  organizations?: Organization;
}

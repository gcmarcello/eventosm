import { BaseEntity } from "@/database/baseEntity";
import {
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
  Ref,
} from "@mikro-orm/core";
import { UserDocument } from "./userDocument.entity";
import { UserInfo } from "./userInfo.entity";
import { Organization } from "@/resources/organizations/entities/organization.entity";
import { OrganizationRole } from "@/resources/organizations/entities/organizationRole.entity";

export enum Role {
  admin = "admin",
  user = "user",
}

@Entity()
export class User extends BaseEntity {
  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ name: "fullName" })
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Property()
  email: string;

  @Property()
  document: string;

  @Property()
  phone: string;

  @Property()
  password: string;

  @Enum()
  role: Role;

  @Property()
  confirmed: boolean;

  @OneToOne()
  info?: Ref<UserInfo>;

  @OneToMany(() => UserDocument, (document) => document.user)
  documents?: [UserDocument];

  @OneToMany(() => Organization, (organization) => organization.owner)
  organizations?: [Organization];

  @ManyToMany(
    () => OrganizationRole,
    (organizationRole) => organizationRole.users
  )
  organizationRoles?: OrganizationRole;
}

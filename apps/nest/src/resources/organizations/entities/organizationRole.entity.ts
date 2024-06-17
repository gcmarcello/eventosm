import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { organizationsSchema } from "@/database/constants";
import { BaseEntity } from "@/database/baseEntity";
import { OrganizationPermission } from "./organizationPermission.entity";
import { Organization } from "./organization.entity";

@ObjectType()
@Entity(organizationsSchema)
export class OrganizationRole extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  name: string;

  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;

  @Field(() => [OrganizationRole], { nullable: true })
  @ManyToMany(() => OrganizationPermission)
  permissions: [OrganizationRole];
}

import { BaseEntity } from "@/database/baseEntity";
import { organizationsSchema } from "@/database/constants";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field } from "@nestjs/graphql";
import { Organization } from "./organization.entity";

@Entity(organizationsSchema)
export class OrganizationCustomDomain extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  domain: string;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;
}

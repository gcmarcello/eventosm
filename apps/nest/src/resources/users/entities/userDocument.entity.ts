import { Enum } from "@/infrastructure/database/decorators";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { BaseEntity } from "@/infrastructure/database/baseEntity";

enum UserDocumentType {
  disability,
  physicalAptitude,
  minorAuthorization,
  others,
}

@Entity()
export class UserDocument extends BaseEntity {
  @Property()
  name?: string;

  @Enum(UserDocumentType)
  type: UserDocumentType;

  @Property()
  file: string;

  @ManyToOne()
  user: User;
}

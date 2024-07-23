import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { User } from "./user.entity";
import { BaseEntity } from "../../../baseEntity";

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

  @Enum()
  type: UserDocumentType;

  @Property()
  file: string;

  @ManyToOne()
  user: User;
}

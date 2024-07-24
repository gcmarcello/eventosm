import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { ConflictException, Injectable } from "@nestjs/common";
import { isUUID } from "class-validator";
import { CreateEventDto, Event, EventStatus } from "shared-types";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: EntityRepository<Event>,
    private em: EntityManager
  ) {}

  async findAll() {
    return this.eventRepo.findAll({ populate: ["organization"] });
  }

  async findOne(identifier: string, admin: boolean = false) {
    const isIdentifierUUID = isUUID(identifier);

    const where = {
      status: admin ? undefined : EventStatus.ACTIVE,
      id: isIdentifierUUID ? identifier : undefined,
      slug: isIdentifierUUID ? undefined : identifier,
    };

    return this.eventRepo.findOne(where);
  }

  async create(data: CreateEventDto) {
    const existingSlug = await this.eventRepo.findOne({ slug: data.slug });

    if (existingSlug)
      throw new ConflictException({
        message: "Já existe um evento com este slug.",
        property: "slug",
      });

    const event = this.eventRepo.create({
      ...data,
      status: EventStatus.PENDING,
    });

    await this.em.flush();
    return event;
  }
}

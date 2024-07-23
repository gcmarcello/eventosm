import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { ConflictException, Injectable } from "@nestjs/common";
import { CreateEventDto, Event } from "shared-types";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: EntityRepository<Event>,
    private em: EntityManager
  ) {}

  async create(data: CreateEventDto) {
    const existingEvent = await this.eventRepo.findOne({ slug: data.slug });

    if (existingEvent)
      throw new ConflictException({
        message: "Já existe um evento com este slug.",
        field: "slug",
      });

    const event = this.eventRepo.create({
      ...data,
    });

    await this.em.flush();
    return event;
  }
}

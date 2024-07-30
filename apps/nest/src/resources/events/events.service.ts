import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { ConflictException, Injectable } from "@nestjs/common";
import { isUUID } from "class-validator";
import {
  CreateEventDto,
  Event,
  EventStatus,
  UpdateEventDto,
} from "shared-types";
import { forbiddenSlugs } from "./constants/forbiddenSlugs";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: EntityRepository<Event>,
    private em: EntityManager
  ) {}

  async findAll(admin: boolean = false) {
    const where: any = {};

    if (!admin) {
      where.status = EventStatus.ACTIVE;
    }

    return this.eventRepo.findAll({
      where,
    });
  }

  async findOne(identifier: string, admin: boolean = false) {
    const isIdentifierUUID = isUUID(identifier);
    const where: any = {};

    if (!admin) {
      where.status = EventStatus.ACTIVE;
    }

    if (isIdentifierUUID) {
      where.id = identifier;
    } else {
      where.slug = identifier;
    }

    return this.eventRepo.findOne(where);
  }

  async create(data: CreateEventDto, activeOrg: string) {
    await this.verifySlug(data.slug);

    const event = this.eventRepo.create({
      ...data,
      status: EventStatus.PENDING,
      organization: activeOrg,
    });

    await this.em.flush();
    return event;
  }

  async update(data: UpdateEventDto, id: string) {
    await this.verifySlug(data.slug, id);

    const event = await this.eventRepo.findOneOrFail(id);

    const updatedEvent = this.eventRepo.assign(event, data);

    await this.em.flush();

    return updatedEvent;
  }

  async verifySlug(slug: string, id?: string) {
    if (forbiddenSlugs.includes(slug))
      throw new ConflictException({
        message: "Este slug é reservado.",
        property: "slug",
      });

    const existingSlug = await this.eventRepo.findOne({
      slug: slug,
      id: { $ne: id },
    });

    if (existingSlug)
      throw new ConflictException({
        message: "Já existe um evento com este slug.",
        property: "slug",
      });
  }
}

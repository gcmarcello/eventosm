import {
  CalendarIcon,
  TrophyIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Event, EventModality, Organization } from "@prisma/client";
import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";
import { Link, Text } from "odinkit";
import { Date } from "odinkit/client";
import { useContext } from "react";
import { EventPageContext } from "../context/EventPage.ctx";

export function EventInfoSection() {
  const { event, organization } = useContext(EventPageContext);
  return (
    <div className="mt-1 grid w-full grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3 ">
      <Text className="flex items-center gap-2 text-sm lg:text-start">
        <CalendarIcon
          style={{
            color: organization.options.colors.primaryColor.hex,
          }}
          className="size-4 lg:size-5"
        />
        {event.dateStart.toISOString() === event.dateEnd.toISOString() ? (
          <>
            <Date date={event.dateStart} format="DD/MM/YYYY" />
          </>
        ) : (
          <>
            <Date date={event.dateStart} format="DD/MM/YYYY" /> -{" "}
            <Date date={event.dateEnd} format="DD/MM/YYYY" />
          </>
        )}
      </Text>

      <Text className="flex items-center gap-2 text-sm lg:text-start">
        <TrophyIcon
          style={{
            color: organization.options.colors.primaryColor.hex,
          }}
          className="size-4 lg:size-5"
        />
        {event.EventModality.length > 1
          ? `${event.EventModality.length} Modalidades`
          : `Modalidade ${event.EventModality[0]?.name}`}
      </Text>

      <div className="col-span-2 flex grid-cols-2 justify-between lg:grid ">
        <Text className="flex items-center gap-2 text-sm lg:text-start">
          <MapPinIcon
            style={{
              color: organization.options.colors.primaryColor.hex,
            }}
            className="size-4 lg:size-5"
          />
          {`${event.location}`}
        </Text>
        <div className="flex gap-2">
          <Link
            target="_blank"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${event.slug}`)}`}
          >
            <FacebookIcon size={22} />
          </Link>
          <Link
            target="_blank"
            href={`https://twitter.com/intent/tweet?text=Olha+esse+evento%3A+${encodeURIComponent(event.name)}+Acesse+no+link%3A++${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${event.slug}`)}`}
          >
            <XIcon size={22} />
          </Link>
          <Link
            target="_blank"
            href={`https://api.whatsapp.com/send?text=Olha+esse+evento%3A+${encodeURIComponent(event.name)}+Acesse+no+link%3A++${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${event.slug}`)}`}
          >
            <WhatsappIcon size={23} />
          </Link>
          <Text className="hidden lg:block">Compartilhe!</Text>
        </div>
      </div>
    </div>
  );
}

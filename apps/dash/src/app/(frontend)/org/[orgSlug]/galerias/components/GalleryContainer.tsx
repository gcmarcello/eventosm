"use client";

import { Gallery, GalleryPhoto, Organization } from "@prisma/client";
import { useMemo, useRef, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Link from "next/link";
import { Heading } from "odinkit";

export function GalleryContainer({
  gallery,
  organization,
}: {
  gallery: Gallery & { GalleryPhoto: GalleryPhoto[] };
  organization: Organization;
}) {
  const [index, setIndex] = useState(-1);
  const thumbnailsRef = useRef(null);
  const lightboxMedias = useMemo(
    () =>
      gallery.GalleryPhoto.map(({ imageUrl }) => ({
        src: process.env.NEXT_PUBLIC_BUCKET_URL + "/images/" + imageUrl,
      })),
    [gallery.GalleryPhoto]
  );

  const albumMedias = useMemo(
    () =>
      gallery.GalleryPhoto.map(({ imageUrl }) => ({
        src: process.env.NEXT_PUBLIC_BUCKET_URL + "/images/" + imageUrl,
        width: 250,
        height: 250,
      })),
    [gallery.GalleryPhoto]
  );

  return (
    <>
      <div className="xxl:mx-40 rounded-md bg-white px-10 py-4">
        <div className="flex items-end gap-2">
          <Heading>{gallery.name}</Heading>
          {(gallery.eventGroupId || gallery.eventId) && (
            <Link
              style={{ color: organization.options.colors.primaryColor.hex }}
              href={
                gallery.eventGroupId
                  ? `/campeonatos/${gallery.eventGroupId}`
                  : `/eventos/${gallery.eventId}`
              }
            >
              Voltar à página do{" "}
              {gallery.eventGroupId ? "campeonato" : "evento"}.
            </Link>
          )}
        </div>
        <PhotoAlbum
          layout="rows"
          padding={(w) => (w < 768 ? 4 : 20)}
          photos={albumMedias}
          onClick={({ index: current }) => setIndex(current)}
        />
      </div>
      <div className="absolute">
        <Lightbox
          plugins={[Thumbnails]}
          thumbnails={{ ref: thumbnailsRef }}
          on={{
            click: () => {
              ((thumbnailsRef.current as any)?.visible
                ? (thumbnailsRef.current as any)?.hide
                : (thumbnailsRef.current as any)?.show)?.();
            },
          }}
          index={index}
          slides={lightboxMedias}
          open={index >= 0}
          close={() => setIndex(-1)}
        />
      </div>
    </>
  );
}

"use client";
import { OrganizationColors } from "prisma/types/Colors";
import { Fragment, useEffect } from "react";
import { create } from "zustand";

interface OrgStoreElements {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  colors: OrganizationColors;
  timezone?: string;
  abbreviation?: string;
  slug: string;
  image?: string;
}

interface OrgStoreSetters {
  set: (OrgStore: OrgStoreElements) => void;
}

type OrgStore = OrgStoreElements & OrgStoreSetters;

const useOrgStore = create<OrgStore>()((set) => ({
  set: (OrgStore: OrgStoreElements) => set(OrgStore),
  id: "",
  name: "",
  email: "",
  phone: "",
  slug: "",
  abbreviation: "",
  colors: {
    primaryColor: {
      id: "indigo_600",
      color: "",
      shade: "",
      hex: "",
      rgb: "",
      tw: {
        color: "indigo",
        shade: "",
        id: "",
      },
    },
    secondaryColor: {
      id: "indigo_600",
      color: "",
      shade: "",
      hex: "",
      rgb: "",
      tw: {
        color: "indigo",
        shade: "",
        id: "",
      },
    },
    tertiaryColor: {
      id: "indigo_600",
      color: "",
      shade: "",
      hex: "",
      rgb: "",
      tw: {
        color: "indigo",
        shade: "",
        id: "",
      },
    },
  },
  timezone: "America/Sao_Paulo",
  image: "",
}));

export function OrgStore(props: { value: OrgStoreElements }) {
  const OrgStore = useOrgStore();

  useEffect(() => {
    OrgStore.set(props.value);
  }, []);

  return <Fragment />;
}

export function useOrg() {
  const { set, ...rest } = useOrgStore();

  return rest;
}

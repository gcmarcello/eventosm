"use client";
import { Color } from "prisma/types/Organization";
import { Fragment, useEffect } from "react";
import { create } from "zustand";

interface OrgStoreElements {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  colors: {
    primaryColor?: Color;
    primaryShade?: string;
    secondaryColor?: Color;
    secondaryShade?: string;
    tertiaryColor?: Color;
    tertiaryShade?: string;
  };
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
    primaryColor: "white",
    primaryShade: "",
    secondaryColor: "dark",
    secondaryShade: "",
    tertiaryColor: "dark",
    tertiaryShade: "",
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

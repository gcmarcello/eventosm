"use client";
import { Color } from "@prisma/client";
import { Fragment, useEffect } from "react";
import { create } from "zustand";

interface PanelStoreElements {
  colors: {
    primaryColor?: Color;
    secondaryColor?: Color;
  };
  timezone?: string;
}

interface PanelStoreSetters {
  set: (panelStore: PanelStoreElements) => void;
}

type PanelStore = PanelStoreElements & PanelStoreSetters;

const usePanelStore = create<PanelStore>()((set) => ({
  set: (panelStore: PanelStoreElements) => set(panelStore),
  colors: {},
}));

export function PanelStore(props: { value: PanelStoreElements }) {
  const panelStore = usePanelStore();

  useEffect(() => {
    panelStore.set(props.value);
  }, []);

  return <Fragment />;
}

export function usePanel() {
  const { set, ...rest } = usePanelStore();

  return rest;
}

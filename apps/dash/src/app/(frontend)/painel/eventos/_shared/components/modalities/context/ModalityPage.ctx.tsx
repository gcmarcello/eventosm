import { UpsertEventModalityDto } from "@/app/api/events/dto";
import { DeleteModalityDto } from "@/app/api/modalities/dto";
import { Event, EventGroup, EventModality } from "@prisma/client";
import { UseFormReturn } from "odinkit/client";
import { EventModalityWithCategories } from "prisma/types/Events";
import { Dispatch, SetStateAction, createContext } from "react";

export class ModalityPageContextProps {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
  removalModalVisibility: boolean;
  setRemovalModalVisibility: Dispatch<SetStateAction<boolean>>;
  selectedModality: EventModality | null;
  setSelectedModality: Dispatch<SetStateAction<EventModality | null>>;
  event?: Event;
  eventGroup?: EventGroup;
  modalityForm: UseFormReturn<UpsertEventModalityDto>;
  modalities: EventModalityWithCategories[];
  deleteModalityForm: UseFormReturn<DeleteModalityDto>;
  handleModalClose: () => void;
  handleModalOpen: ({ id, name }: { id?: string; name?: string }) => void;
  handleRemovalModalOpen: (modalityId: string) => void;
}

export const ModalityPageContext = createContext(
  new ModalityPageContextProps()
);

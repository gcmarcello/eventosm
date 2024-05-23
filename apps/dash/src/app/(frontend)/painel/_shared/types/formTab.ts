import { z } from "zod";

export const formTab = z.object({ currentTab: z.string() });

export type FormTab = z.infer<typeof formTab>;

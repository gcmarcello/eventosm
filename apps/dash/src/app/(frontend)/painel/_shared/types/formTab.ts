import { z } from "zod";

export const tabControl = z.object({ currentTab: z.string() });

export type TabControl = z.infer<typeof tabControl>;

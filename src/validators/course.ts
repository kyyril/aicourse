import z from "zod";

export const createChaptersSchema = z.object({
  title: z.string().min(3).max(100),
  topics: z.array(z.string()),
});

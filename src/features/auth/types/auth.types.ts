import { z } from "zod";
import { loginSchema, registerSchema } from "../schema/authSchema";

export type LoginDataType = z.infer<typeof loginSchema>;
export type RegisterDataType = z.infer<typeof registerSchema>;
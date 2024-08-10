import { z } from "zod";

export const useUserSchema = z.object({
  username: z
    .string({ message: "Ce champs est requis !" })
    .min(1, "le nom d'utilisateur est requis !"),
  password: z
    .string({ message: "Ce champs est requis !" })
    .min(8, "le mot de passe doit contenir au moins 8 caractères !"),
});

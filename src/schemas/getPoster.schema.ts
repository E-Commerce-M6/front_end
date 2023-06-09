import { z } from "zod";

const getPostSchema = z.object({
  brand: z.string().nonempty("Marca é obrigatória"),
  model: z.string().nonempty("Modelo é obrigatório"),
  year: z.string().nonempty("Ano é obrigatório"),
  fuel_type: z.string().nonempty(),
  kilometers: z.string().nonempty("Quilometragem é obrigatória").or(z.number()),
  color: z.string().nonempty("Cor é obrigatória"),
  fipe_price: z
    .string()
    .transform((fipe_price) => {
      return fipe_price.toString().replace(/[\.]/g, "").replace(",", ".");
    })
    .or(z.number()),
  price: z
    .string()
    .nonempty("Preço é obrigatório")
    .transform((price) => {
      return price.toString().replace(/[\.]/g, "").replace(",", ".");
    })
    .or(z.number()),
  description: z.string().nonempty("Descrição é obrigatória"),
  is_published: z.boolean().optional().default(false),
  images: z.array(
    z.object({
      url: z.string().nonempty("A imagem é obrigatória").url("Insira uma url válida"),
    })
  ),
  publish_option: z.enum(["y", "n"]).optional(),
});

export default getPostSchema;

// export async function getProducts(req, reply) {
//   const { search, category } = req.query as any;

//   let query = supabase
//     .from("products")
//     .select("*")
//     .eq("is_active", true);

//   if (search) {
//     query = query.ilike("title", `%${search}%`);
//   }

//   if (category) {
//     query = query.eq("category", category);
//   }

//   const { data, error } = await query;

//   if (error) return reply.status(400).send(error);

//   return data;
// }

// export async function getProduct(req, reply) {
//   const { id } = req.params as any;

//   const { data, error } = await supabase
//     .from("products")
//     .select("*")
//     .eq("id", id)
//     .single();

//   if (error) return reply.status(404).send({ message: "Not found" });

//   return data;
// }

// export async function createProduct(req, reply) {
//   const body = req.body as any;

//   const { data, error } = await supabase
//     .from("products")
//     .insert({
//       title: body.title,
//       description: body.description,
//       price: body.price,
//       category: body.category,
//       image: body.image,
//       is_active: true,
//     })
//     .select()
//     .single();

//   if (error) return reply.status(400).send(error);

//   return data;
// }

// export async function updateProduct(req, reply) {
//   const { id } = req.params as any;
//   const body = req.body as any;

//   const { data, error } = await supabase
//     .from("products")
//     .update(body)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) return reply.status(400).send(error);

//   return data;
// }

// export async function deleteProduct(req, reply) {
//   const { id } = req.params as any;

//   const { error } = await supabase
//     .from("products")
//     .update({ is_active: false })
//     .eq("id", id);

//   if (error) return reply.status(400).send(error);

//   return { message: "Product deleted (soft)" };
// }

import { supabase } from "../../config/supabase";

export class ProductsService {
  // Get all products (with filters)
  static async getAll(filters?: { search?: string; category?: string }) {
    let query = supabase.from("products").select("*").eq("is_active", true);

    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Get single product
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Create product (admin)
  static async create(data: {
    title: string;
    description?: string;
    price: number;
    category?: string;
    image?: string;
  }) {
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return product;
  }

  // Update product (admin)
  static async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      price: number;
      category: string;
      image: string;
      is_active: boolean;
    }>,
  ) {
    const { data: product, error } = await supabase
      .from("products")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return product;
  }

  // Soft delete product (admin)
  static async delete(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: "Product deleted successfully",
    };
  }
}

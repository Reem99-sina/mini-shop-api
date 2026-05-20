import { supabase } from "../../config/supabase";

export class OrdersService {
  // PLACE ORDER
  static async create(userId: string, items: any[]) {
    let total = 0;

    // calculate total
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const { data: product } = await supabase
          .from("products")
          .select("price")
          .eq("id", item.product_id)
          .maybeSingle();

        const price = product?.price || 0;
        total += price * item.quantity;

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price,
        };
      }),
    );

    // create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total,
        status: "pending",
      })
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);

    // insert items
    await supabase.from("order_items").insert(
      orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      })),
    );

    return order;
  }

  // USER ORDERS
  static async getMyOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      order_items (
        *,
        products (
          id,
          title,
          description,
          price,
          image,
          category
        )
      )
    `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  }

  // ADMIN ALL ORDERS
  static async getAll(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  }

  // UPDATE STATUS
  static async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
  }
}

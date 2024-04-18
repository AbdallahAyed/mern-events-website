import { getOrdersByEvent } from "@/actions/order.actions";
import Search from "@/components/shared/Search";
import { SearchParamProps } from "@/types";
import { formatDateTime, formatPrice } from "@/lib/utils";

export default async function OrdersPage({ searchParams }: SearchParamProps) {
  const eventId = (searchParams?.eventId as string) || "";
  const searchText = (searchParams?.query as string) || "";

  const orders = await getOrdersByEvent({ eventId, searchString: searchText });
  
  return (
    <div className="h-[78vh]">
      <section className="wrapper bg-primary-50 bg-dotted-pattern bg-cover bg-center py-1 h-full">
        <h3 className="wrapper h3-bold text-center sm:text-left ">Orders</h3>

        <Search placeholder="Search buyer name..." />

        <table className="w-full border-collapse border-t overflow-x-auto mt-9">
          <thead>
            <tr className="p-medium-14 border-b text-grey-500">
              <th className="min-w-[250px] py-3 text-left">Order ID</th>
              <th className="min-w-[200px] flex-1 py-3 pr-4 text-left">
                Event Title
              </th>
              <th className="min-w-[150px] py-3 text-left">Buyer</th>
              <th className="min-w-[100px] py-3 text-left">Created</th>
              <th className="min-w-[100px] py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders?.data && orders.data.length === 0 ? (
              <tr className="border-b">
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              <>
                {orders?.data &&
                  orders.data.map((row: any) => (
                    <tr
                      key={row.id}
                      className="p-regular-14 lg:p-regular-16 border-b "
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[250px] py-4 text-primary-500">
                        {row.id}
                      </td>
                      <td className="min-w-[200px] flex-1 py-4 pr-4">
                        {row.event.title}
                      </td>
                      <td className="min-w-[150px] py-4">
                        {row.buyer.firstName} {row.buyer.lastName}
                      </td>
                      <td className="min-w-[100px] py-4">
                        {formatDateTime(row.createdAt).dateTime}
                      </td>
                      <td className="min-w-[100px] py-4 text-right">
                        {formatPrice(row.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

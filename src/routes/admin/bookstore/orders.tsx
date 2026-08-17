import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

type Order = {
  id: number;
  user_email: string;
  total_amount: string;
  status: string;
  created_at: string;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch<Order[]>("/bookstore/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Failed to fetch orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await apiFetch(`/bookstore/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      toast.success("Order status updated");
      fetchOrders();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Order Management</h2>
          <p className="text-sm text-slate-500">View and update customer orders.</p>
        </div>
      </div>
      
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-[180px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">#{o.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell>{o.user_email}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>₹{o.total_amount}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(val) => updateStatus(o.id, val)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

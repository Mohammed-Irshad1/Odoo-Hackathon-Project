import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

function AdminApprovals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchUnapproved() {
    setLoading(true);
    axios.get("/api/admin/products/unapproved").then(res => {
      setProducts(res.data.data || []);
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUnapproved();
  }, []);

  function handleApprove(id) {
    axios.put(`/api/admin/products/approve/${id}`).then(fetchUnapproved);
  }
  function handleReject(id) {
    axios.delete(`/api/admin/products/reject/${id}`).then(fetchUnapproved);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Product Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-muted-foreground">No products pending approval.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Brand</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-2 font-semibold">{product.title}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">{product.brand}</td>
                    <td className="p-2">${product.price}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(product._id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(product._id)}>
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminApprovals; 
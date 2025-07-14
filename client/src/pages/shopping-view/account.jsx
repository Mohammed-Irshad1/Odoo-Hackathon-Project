import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

function PointsAndSwaps() {
  const { user } = useSelector((state) => state.auth);
  console.log("PointsAndSwaps component mounted", user);
  const [points, setPoints] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    setLoading(true);
    axios.get(`/api/shop/points/user/${userId}`)
      .then(res => {
        console.log('Fetched points:', res.data.points, 'for user:', user);
        setPoints(res.data.points);
      })
      .catch(() => setPoints(null));
    axios.get(`/api/shop/swaps/user/${userId}`)
      .then(res => setSwaps(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(() => setSwaps([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSwapAction = async (swapId, status) => {
    setActionLoading((prev) => ({ ...prev, [swapId]: true }));
    try {
      await axios.put(`/api/shop/swaps/update/${swapId}`, { status });
      setSwaps((prev) => prev.map(swap => swap._id === swapId ? { ...swap, status } : swap));
    } catch (e) {
      alert('Failed to update swap status');
    }
    setActionLoading((prev) => ({ ...prev, [swapId]: false }));
  };

  const responderSwaps = swaps.filter(swap => swap.responder?._id === (user._id || user.id));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Points Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{points !== null ? points : "-"}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Swaps</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : swaps.length === 0 ? (
            <div className="text-muted-foreground">No swaps yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Requested Item</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">With</th>
                  </tr>
                </thead>
                <tbody>
                  {swaps.map((swap) => (
                    <tr key={swap._id} className="border-b">
                      <td className="p-2">{swap.requestedItem?.title || "-"}</td>
                      <td className="p-2 capitalize">{swap.status}</td>
                      <td className="p-2 capitalize">{swap.type}</td>
                      <td className="p-2">{swap.responder?._id === user._id ? swap.requester?.userName : swap.responder?.userName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* New section: Swaps to Respond To */}
      <Card>
        <CardHeader>
          <CardTitle>Swap Requests for Your Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : responderSwaps.length === 0 ? (
            <div className="text-muted-foreground">No swap requests for your items.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Offered Item</th>
                    <th className="text-left p-2">Requested Item</th>
                    <th className="text-left p-2">From</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {responderSwaps.map((swap) => (
                    <tr key={swap._id} className="border-b">
                      <td className="p-2">{swap.offeredItem?.title || "-"}</td>
                      <td className="p-2">{swap.requestedItem?.title || "-"}</td>
                      <td className="p-2">{swap.requester?.userName || "-"}</td>
                      <td className="p-2 capitalize">{swap.status}</td>
                      <td className="p-2">
                        {swap.status === 'pending' && (
                          <>
                            <button
                              className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                              disabled={actionLoading[swap._id]}
                              onClick={() => handleSwapAction(swap._id, 'accepted')}
                            >
                              {actionLoading[swap._id] ? 'Accepting...' : 'Accept'}
                            </button>
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded"
                              disabled={actionLoading[swap._id]}
                              onClick={() => handleSwapAction(swap._id, 'rejected')}
                            >
                              {actionLoading[swap._id] ? 'Rejecting...' : 'Reject'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="points">Points & Swaps</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
            <TabsContent value="points">
              <PointsAndSwaps />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;

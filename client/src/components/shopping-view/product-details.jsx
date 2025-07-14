import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Dialog as SwapDialog, DialogContent as SwapDialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import axios from "axios";
import PropTypes from "prop-types";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { productList } = useSelector((state) => state.shopProducts);
  const [selectedSwapItem, setSelectedSwapItem] = useState(null);

  // Points redemption state
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id || user?._id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      console.log('Review submission result:', data);
      if (data && data.payload && data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: data && data.payload && data.payload.message ? data.payload.message : "Failed to add review.",
          variant: "destructive",
        });
      }
    });
  }

  async function handleRedeemWithPoints() {
    console.log("Redeem with Points button clicked");
    const payload = {
      userId: user?._id || user?.id,
      productId: productDetails?._id || productDetails?.id,
    };
    console.log("Redeem payload:", payload);
    setRedeemLoading(true);
    try {
      const res = await axios.post("/api/shop/points/redeem", payload);
      console.log("Redeem response:", res.data);
      if (res.data.success) {
        toast({ title: res.data.message });
      } else {
        toast({ title: res.data.message, variant: "destructive" });
      }
    } catch (e) {
      console.log("Redeem error:", e);
      toast({ title: "Redemption failed", variant: "destructive" });
    } finally {
      setRedeemLoading(false);
    }
  }

  async function handleSubmitSwap() {
    if (!selectedSwapItem) return;
    setSwapLoading(true);
    try {
      await axios.post("/api/shop/swaps/create", {
        requester: user._id || user.id,
        responder: productDetails.userId,
        requestedItem: productDetails._id,
        offeredItem: selectedSwapItem,
        type: "swap"
      });
      toast({ title: "Swap request sent!" });
      setSwapDialogOpen(false);
      setSelectedSwapItem(null);
    } catch (err) {
      toast({ title: err.response?.data?.message || "Swap failed", variant: "destructive" });
    }
    setSwapLoading(false);
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // Filter user's own available, approved items
  const userAvailableItems = productList.filter(
    (item) =>
      (item.userId === (user._id || user.id)) &&
      item.status === "available" &&
      item.approval === true &&
      item._id !== productDetails?._id // Don't allow offering the same item
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
            {/* Redeem with Points Button */}
            {user && productDetails?.status === "available" && productDetails?.approval === true && (
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={handleRedeemWithPoints}
                disabled={redeemLoading}
              >
                {redeemLoading ? "Redeeming..." : `Redeem with Points${productDetails?.pointsValue ? ` (${productDetails.pointsValue} pts)` : ""}`}
              </Button>
            )}
            {/* Swap Button */}
            {user && productDetails?.status === "available" && productDetails?.approval === true && productDetails?.userId !== (user._id || user.id) && (
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={() => setSwapDialogOpen(true)}
              >
                Swap
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, idx) => (
                  <div className="flex gap-4" key={reviewItem._id || idx}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* Swap Dialog Modal */}
      <SwapDialog open={swapDialogOpen} onOpenChange={setSwapDialogOpen}>
        <SwapDialogContent>
          <h2 className="text-xl font-bold mb-4">Propose a Swap</h2>
          <p className="mb-4">Select one of your items to offer in exchange:</p>
          {userAvailableItems.length === 0 ? (
            <div className="mb-4 text-muted-foreground">You have no available items to offer for swap.</div>
          ) : (
            <div className="mb-4 flex flex-col gap-2">
              {userAvailableItems.map((item) => (
                <label key={item._id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="swapItem"
                    value={item._id}
                    checked={selectedSwapItem === item._id}
                    onChange={() => setSelectedSwapItem(item._id)}
                  />
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                  <span>{item.title}</span>
                </label>
              ))}
            </div>
          )}
          <Button className="mt-4" onClick={() => setSwapDialogOpen(false)}>Cancel</Button>
          <Button className="mt-4 ml-2" disabled={!selectedSwapItem || swapLoading} onClick={handleSubmitSwap}>
            {swapLoading ? "Submitting..." : "Submit Swap"}
          </Button>
        </SwapDialogContent>
      </SwapDialog>
    </Dialog>
  );
}

ProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.object,
};

export default ProductDetailsDialog;

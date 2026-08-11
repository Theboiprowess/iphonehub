"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  Search, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Send,
  AlertTriangle
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type Review = {
  id: string;
  productId: string;
  userId: string | null;
  rating: number;
  title: string | null;
  comment: string;
  name: string | null;
  isApproved: boolean;
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    model: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Review | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/reviews?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, statusFilter, searchQuery]);

  const updateReview = async (reviewId: string, updateData: any) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/reviews`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId, ...updateData }),
      });
      if (!response.ok) {
        throw new Error("Failed to update review");
      }
      await fetchReviews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const approveReview = async (review: Review) => {
    await updateReview(review.id, { isApproved: true });
  };

  const rejectReview = async (review: Review) => {
    await updateReview(review.id, { isApproved: false });
  };

  const submitAdminResponse = async (review: Review) => {
    if (!adminResponse.trim()) return;
    await updateReview(review.id, { adminResponse });
    setAdminResponse("");
  };

  const deleteReview = async (reviewId: string, confirmed: boolean = false) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/reviews?id=${reviewId}&confirmed=${confirmed}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      const data = await response.json();
      
      if (data.requiresConfirmation) {
        setDeleteConfirm(selectedReview);
        return;
      }

      setDeleteConfirm(null);
      setSelectedReview(null);
      await fetchReviews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved 
      ? "bg-green-100 text-green-800" 
      : "bg-yellow-100 text-yellow-800";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-[#CDB586] text-[#CDB586]" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Reviews" subtitle="Manage customer reviews" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Reviews" subtitle="Manage customer reviews" />

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/50" />
                <Input
                  placeholder="Search reviews by customer, product, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Reviews</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <Star className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Product</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Rating</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Review</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Date</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{review.product.name}</div>
                        <div className="text-sm text-[#5F3C18]/60">{review.product.model}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">
                          {review.name || review.user?.name || "Anonymous"}
                        </div>
                        {review.user?.email && (
                          <div className="text-sm text-[#5F3C18]/60">{review.user.email}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {renderStars(review.rating)}
                      </td>
                      <td className="p-4">
                        {review.title && (
                          <div className="font-medium text-[#0E161B] mb-1">{review.title}</div>
                        )}
                        <div className="text-sm text-[#5F3C18]/60 line-clamp-2 max-w-xs">
                          {review.comment}
                        </div>
                        {review.adminResponse && (
                          <div className="mt-2 text-sm text-[#CDB586]">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            Admin responded
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(review.isApproved)}>
                          {review.isApproved ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedReview(review);
                                setAdminResponse(review.adminResponse || "");
                              }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Review Details</DialogTitle>
                              </DialogHeader>
                              {selectedReview && (
                                <div className="space-y-6">
                                  {/* Product Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Product</h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg">
                                      <div className="font-medium">{selectedReview.product.name}</div>
                                      <div className="text-sm text-[#5F3C18]/60">{selectedReview.product.model}</div>
                                    </div>
                                  </div>

                                  {/* Customer Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer</h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-1">
                                      <div><strong>Name:</strong> {selectedReview.name || selectedReview.user?.name || "Anonymous"}</div>
                                      {selectedReview.user?.email && (
                                        <div><strong>Email:</strong> {selectedReview.user.email}</div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Rating */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Rating</h4>
                                    <div className="flex items-center gap-2">
                                      {renderStars(selectedReview.rating)}
                                      <span className="text-[#5F3C18]/60">({selectedReview.rating}/5)</span>
                                    </div>
                                  </div>

                                  {/* Review Content */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Review</h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                      {selectedReview.title && (
                                        <div className="font-medium">{selectedReview.title}</div>
                                      )}
                                      <div className="text-[#0E161B] whitespace-pre-wrap">
                                        {selectedReview.comment}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Admin Response */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Admin Response</h4>
                                    <Textarea
                                      value={adminResponse}
                                      onChange={(e) => setAdminResponse(e.target.value)}
                                      placeholder="Type your response to this review..."
                                      rows={4}
                                      className="bg-[#F7F5EF]"
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        onClick={() => submitAdminResponse(selectedReview)}
                                        disabled={updating || !adminResponse.trim()}
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        Post Response
                                      </Button>
                                      {selectedReview.adminResponse && (
                                        <Button
                                          variant="outline"
                                          onClick={() => updateReview(selectedReview.id, { adminResponse: "" })}
                                          disabled={updating}
                                        >
                                          Clear Response
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Approval Actions */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Moderation</h4>
                                    <div className="flex gap-2">
                                      {!selectedReview.isApproved ? (
                                        <Button
                                          onClick={() => approveReview(selectedReview)}
                                          disabled={updating}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve Review
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() => rejectReview(selectedReview)}
                                          disabled={updating}
                                          variant="outline"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Unapprove Review
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Delete */}
                                  <div className="pt-4 border-t border-[#CDB586]/20">
                                    <Button
                                      variant="outline"
                                      className="text-red-600 border-red-600 hover:bg-red-600/10"
                                      onClick={() => deleteReview(selectedReview.id)}
                                      disabled={updating}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Review
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedReview(review);
                              deleteReview(review.id);
                            }}
                            disabled={updating}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#CDB586]/20">
              <div className="text-sm text-[#5F3C18]/60">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          {deleteConfirm && (
            <div className="space-y-4">
              <p className="text-[#5F3C18]">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                <div><strong>Product:</strong> {deleteConfirm.product.name}</div>
                <div><strong>Customer:</strong> {deleteConfirm.name || deleteConfirm.user?.name || "Anonymous"}</div>
                <div><strong>Rating:</strong> {deleteConfirm.rating}/5</div>
                <div className="text-sm text-[#5F3C18]/60 line-clamp-2">
                  <strong>Review:</strong> {deleteConfirm.comment}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-600/10"
                  onClick={() => deleteReview(deleteConfirm.id, true)}
                  disabled={updating}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

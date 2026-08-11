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
  MessageSquare, 
  Search, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [responseText, setResponseText] = useState("");

  const enquiryStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/enquiries?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch enquiries");
      }
      const data = await response.json();
      setEnquiries(data.enquiries);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter, searchQuery]);

  const updateEnquiry = async (enquiryId: string, updateData: any) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/enquiries`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enquiryId, ...updateData }),
      });
      if (!response.ok) {
        throw new Error("Failed to update enquiry");
      }
      await fetchEnquiries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteEnquiry = async (enquiryId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/enquiries?id=${enquiryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete enquiry");
      }
      await fetchEnquiries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const sendEmail = (enquiry: Enquiry) => {
    const subject = encodeURIComponent(`Re: ${enquiry.subject}`);
    const body = encodeURIComponent(`\n\n--- Original Message ---\n\n${enquiry.message}`);
    window.open(`mailto:${enquiry.email}?subject=${subject}&body=${body}`);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      RESOLVED: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Enquiries" subtitle="Manage customer enquiries" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading enquiries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Enquiries" subtitle="Manage customer enquiries" />

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
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {enquiryStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Enquiries ({enquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {enquiries.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No enquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Subject</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Date</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{enquiry.name}</div>
                        <div className="text-sm text-[#5F3C18]/60">{enquiry.email}</div>
                        <div className="text-sm text-[#5F3C18]/60">{enquiry.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{enquiry.subject}</div>
                        <div className="text-sm text-[#5F3C18]/60 line-clamp-1 max-w-xs">
                          {enquiry.message}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(enquiry.status)}>
                          {enquiry.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enquiry)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Enquiry Details</DialogTitle>
                              </DialogHeader>
                              {selectedEnquiry && (
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      Customer Information
                                    </h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                      <div><strong>Name:</strong> {selectedEnquiry.name}</div>
                                      <div><strong>Email:</strong> {selectedEnquiry.email}</div>
                                      <div><strong>Phone:</strong> {selectedEnquiry.phone}</div>
                                    </div>
                                  </div>

                                  {/* Enquiry Message */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Message</h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg">
                                      <div className="font-medium mb-2">{selectedEnquiry.subject}</div>
                                      <div className="text-[#0E161B] whitespace-pre-wrap">{selectedEnquiry.message}</div>
                                    </div>
                                  </div>

                                  {/* Admin Response */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Response</h4>
                                    <Textarea
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                      placeholder="Type your response..."
                                      rows={4}
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        onClick={() => {
                                          updateEnquiry(selectedEnquiry.id, { 
                                            response: responseText,
                                            status: "RESOLVED" 
                                          });
                                          setResponseText("");
                                        }}
                                        disabled={updating || !responseText}
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Response
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => sendEmail(selectedEnquiry)}
                                      >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Status Management */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Status</h4>
                                    <Select 
                                      value={selectedEnquiry.status} 
                                      onValueChange={(value) => updateEnquiry(selectedEnquiry.id, { status: value })}
                                      disabled={updating}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {enquiryStatuses.map((status) => (
                                          <SelectItem key={status} value={status}>
                                            {status.replace(/_/g, " ")}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteEnquiry(enquiry.id)}
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
    </div>
  );
}

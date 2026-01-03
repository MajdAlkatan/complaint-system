import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Filter, Download, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { useComplaintStore } from "../app/store/complaint.store";
import ComplaintList from "../components/ComplaintList";

const ComplaintsPage = () => {
  const { complaints, loading, error, fetchComplaints } = useComplaintStore();

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Calculate statistics
  const stats = {
    total: complaints.length,
    new: complaints.filter((c) => c.status === "new").length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
    locked: complaints.filter((c) => c.locked).length,
  };

  const handleRefresh = () => {
    fetchComplaints();
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting complaints...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Complaints Management
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage citizen complaints efficiently
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 font-medium">Total</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-blue-200">
              <CardContent className="p-4">
                <div className="text-sm text-blue-600 font-medium">New</div>
                <div className="text-2xl font-bold text-blue-700 mt-1">
                  {stats.new}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-600 font-medium">
                  Pending
                </div>
                <div className="text-2xl font-bold text-amber-700 mt-1">
                  {stats.pending}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-purple-200">
              <CardContent className="p-4">
                <div className="text-sm text-purple-600 font-medium">
                  In Progress
                </div>
                <div className="text-2xl font-bold text-purple-700 mt-1">
                  {stats.inProgress}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-green-200">
              <CardContent className="p-4">
                <div className="text-sm text-green-600 font-medium">
                  Resolved
                </div>
                <div className="text-2xl font-bold text-green-700 mt-1">
                  {stats.resolved}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-red-200">
              <CardContent className="p-4">
                <div className="text-sm text-red-600 font-medium">Rejected</div>
                <div className="text-2xl font-bold text-red-700 mt-1">
                  {stats.rejected}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-600 font-medium">Locked</div>
                <div className="text-2xl font-bold text-amber-700 mt-1">
                  {stats.locked}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>New: {stats.new}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Pending: {stats.pending}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>In Progress: {stats.inProgress}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Resolved: {stats.resolved}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Rejected: {stats.rejected}</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">
                  Error Loading Complaints
                </h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="ml-auto text-red-700 border-red-300 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading complaints...</p>
            </div>
          </div>
        )}

        {/* Main Content - Complaint List */}
        {!loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Complaints
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {complaints.length} complaint
                    {complaints.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Auto-refresh: 30s
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ComplaintList />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && complaints.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Complaints Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              There are currently no complaints in the system. New complaints
              will appear here when citizens submit them.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={handleRefresh} variant="outline">
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Test Complaint
              </Button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Complaint Management System • Last updated: Just now •
            <Button
              variant="link"
              className="text-blue-600 h-auto p-0 ml-1"
              onClick={handleRefresh}
            >
              Refresh now
            </Button>
          </p>
          <p className="mt-2 text-xs">
            Need help? Contact support for assistance with complaint management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;

import React, { useEffect } from "react";
import { useCitizenStore } from "../../app/store/citizenStore";
import CitizenList from "../../components/citizens/CitizenList";
import {
  AlertCircle,
  RefreshCw,
  Users,
  Download,
  BarChart,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";

const AdminCitizenPage = () => {
  const { citizens, loading, error, fetchCitizens } = useCitizenStore();

  // Fetch citizens on component mount
  useEffect(() => {
    fetchCitizens();
  }, []);

  // Calculate statistics
  const stats = {
    total: citizens.length,
    active: citizens.filter((c) => c.account_status === "active").length,
    suspended: citizens.filter((c) => c.account_status === "suspended").length,
    inactive: citizens.filter((c) => c.account_status === "inactive").length,
  };

  const handleRefresh = () => {
    fetchCitizens();
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting citizens data...");
  };

  const handleGenerateReport = () => {
    // Report generation would go here
    console.log("Generating citizen report...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                Citizen Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage citizen profiles, accounts, and information
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
                Export Data
              </Button>
              <Button
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={handleGenerateReport}
              >
                <BarChart className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 font-medium">
                  Total Citizens
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-green-200">
              <CardContent className="p-4">
                <div className="text-sm text-green-600 font-medium">Active</div>
                <div className="text-2xl font-bold text-green-700 mt-1">
                  {stats.active}
                </div>
                <div className="text-xs text-green-500 mt-1">
                  {stats.total > 0
                    ? `${Math.round((stats.active / stats.total) * 100)}%`
                    : "0%"}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-red-200">
              <CardContent className="p-4">
                <div className="text-sm text-red-600 font-medium">
                  Suspended
                </div>
                <div className="text-2xl font-bold text-red-700 mt-1">
                  {stats.suspended}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 font-medium">
                  Inactive
                </div>
                <div className="text-2xl font-bold text-gray-700 mt-1">
                  {stats.inactive}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">
                  Error Loading Citizens
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
              <p className="text-gray-600">Loading citizens...</p>
            </div>
          </div>
        )}

        {/* Main Content - Citizen List */}
        {!loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Citizen Directory
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage all registered citizens in the system
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Last updated: Just now
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
              <CitizenList />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && citizens.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Citizens Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              There are currently no citizens registered in the system. Citizens
              will appear here when they register accounts.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={handleRefresh} variant="outline">
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Import Citizens
              </Button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Citizen Management System • {stats.total} total citizens •
            <Button
              variant="link"
              className="text-blue-600 h-auto p-0 ml-1"
              onClick={handleRefresh}
            >
              Refresh data
            </Button>
          </p>
          <p className="mt-2 text-xs">
            Citizen data is securely stored and managed in compliance with
            privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminCitizenPage;

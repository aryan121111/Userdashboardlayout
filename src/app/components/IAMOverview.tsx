import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Users,
  ShieldAlert,
  AlertTriangle,
  Key,
  LogOut,
} from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { RiskBadge } from "./RiskBadge";
import { mockIAMUsers, iamStats } from "../data/mockIAMData";
import { IAMUser } from "../types/iam";
import { getDaysSinceDate } from "../types/iam";

export function IAMOverview() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [lastUsedFilter, setLastUsedFilter] =
    useState<string>("all");

  // Filter users
  const filteredUsers = mockIAMUsers.filter((user) => {
    const matchesSearch =
      user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;
    const matchesRisk =
      riskFilter === "all" || user.riskLevel === riskFilter;

    let matchesLastUsed = true;
    if (lastUsedFilter !== "all") {
      const daysSince = getDaysSinceDate(user.lastActive);
      if (lastUsedFilter === "7days")
        matchesLastUsed = daysSince <= 7;
      else if (lastUsedFilter === "30days")
        matchesLastUsed = daysSince <= 30;
      else if (lastUsedFilter === "60days")
        matchesLastUsed = daysSince > 60;
    }

    return (
      matchesSearch &&
      matchesRole &&
      matchesRisk &&
      matchesLastUsed
    );
  });

  const getPermissionsSummary = (user: IAMUser) => {
    if (user.permissions.length === 1)
      return user.permissions[0].name;
    return `${user.permissions.length} permissions`;
  };

  const formatLastUsed = (dateString: string) => {
    const days = getDaysSinceDate(dateString);
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 60) return `${Math.floor(days / 30)} month ago`;
    return `${days} days ago`;
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              IAM&nbsp;&nbsp;Dashboard{" "}
            </h1>
            <p className="text-gray-600 mt-1">
              <span className="font-bold">
                Identity and Access Management Control Panel
              </span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Users / Roles"
            value={`${iamStats.totalUsers} / ${iamStats.totalRoles}`}
            icon={Users}
            trend="+2 new this week"
            trendUp={true}
          />
          <SummaryCard
            title="High-Risk Users"
            value={iamStats.highRiskUsers}
            icon={ShieldAlert}
            trend="⚠️ Needs attention"
            trendUp={false}
          />
          <SummaryCard
            title="Unused Permissions"
            value={iamStats.unusedPermissions}
            icon={AlertTriangle}
            trend="60+ days inactive"
            trendUp={false}
          />
          <SummaryCard
            title="Total Permissions"
            value={mockIAMUsers.reduce(
              (sum, u) => sum + u.permissions.length,
              0,
            )}
            icon={Key}
            trend="Across all users"
            trendUp={true}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm bg-[#12eff38c] bg-[#19cfd28c]">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-[#1b1b1a0f]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="text-gray-400 w-5 h-5 bg-[#00000000]" />

              {/* Role Type */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-[#0000001a]"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Service">Service</option>
              </select>

              {/* Risk Level */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-[#0000002e]"
              >
                <option value="all">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>

              {/* Last Used */}
              <select
                value={lastUsedFilter}
                onChange={(e) =>
                  setLastUsedFilter(e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-[#00000033]"
              >
                <option value="all">All Activity</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="60days">60+ days ago</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#10ecf40d]">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getPermissionsSummary(user)}
                      </div>
                      {user.permissions.some(
                        (p) => p.isPublic,
                      ) && (
                        <div className="text-xs text-orange-600 mt-1">
                          ⚠️ Includes public access
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatLastUsed(user.lastActive)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RiskBadge
                          level={user.riskLevel}
                          score={user.riskScore}
                          showScore={true}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
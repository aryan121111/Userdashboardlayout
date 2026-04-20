import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Shield, Activity, AlertTriangle, Clock, Trash2, TrendingDown, CheckCircle } from 'lucide-react';
import { mockIAMUsers } from '../data/mockIAMData';
import { RiskBadge } from './RiskBadge';
import { getDaysSinceDate } from '../types/iam';
import { Permission } from '../types/iam';

export function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const user = mockIAMUsers.find(u => u.id === userId);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">User not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to overview
          </button>
        </div>
      </div>
    );
  }

  const unusedPermissions = user.permissions.filter(p => {
    if (!p.lastUsed) return true;
    return getDaysSinceDate(p.lastUsed) >= 60;
  });

  const riskyPermissions = user.permissions.filter(p => 
    p.riskLevel === 'High' || p.isPublic
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never used';
    const days = getDaysSinceDate(dateString);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${days} days ago`;
  };

  const getRiskScoreBreakdown = () => {
    const breakdown: { label: string; points: number; reason: string }[] = [];
    
    if (user.role === 'Admin') {
      breakdown.push({ label: 'Admin Access', points: 50, reason: 'Full administrative privileges' });
    }
    
    const daysSinceActive = getDaysSinceDate(user.lastActive);
    if (daysSinceActive >= 60) {
      breakdown.push({ label: 'Inactive Account', points: 30, reason: `Not used for ${daysSinceActive} days` });
    }
    
    if (user.permissions.some(p => p.isPublic)) {
      breakdown.push({ label: 'Public Access', points: 40, reason: 'Has public-facing permissions' });
    }
    
    const highRiskCount = user.permissions.filter(p => 
      p.name.includes('Full Access') || p.action.includes('Delete') || p.action.includes('*')
    ).length;
    if (highRiskCount > 0) {
      breakdown.push({ 
        label: 'High-Risk Permissions', 
        points: highRiskCount * 10, 
        reason: `${highRiskCount} high-risk permission(s)` 
      });
    }
    
    return breakdown;
  };

  const riskBreakdown = getRiskScoreBreakdown();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900">User Details</h1>
            <p className="text-gray-600 mt-1">Comprehensive access and permissions overview</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                  <RiskBadge level={user.riskLevel} score={user.riskScore} showScore={true} />
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Account created: {new Date(user.accountCreated).toLocaleDateString()}</p>
              <p>Last active: {formatDate(user.lastActive)}</p>
            </div>
          </div>
        </div>

        {/* Risk Score Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Score Breakdown</h3>
          </div>
          <div className="space-y-3">
            {riskBreakdown.length > 0 ? (
              riskBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.reason}</div>
                  </div>
                  <div className="text-lg font-semibold text-red-600">+{item.points}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No risk factors detected</p>
            )}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="font-semibold text-gray-900">Total Risk Score</div>
              <div className="text-xl font-bold text-blue-600">{user.riskScore}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risky Permissions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Risky Permissions</h3>
              <span className="ml-auto bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                {riskyPermissions.length}
              </span>
            </div>
            <div className="space-y-2">
              {riskyPermissions.length > 0 ? (
                riskyPermissions.map((perm) => (
                  <div key={perm.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{perm.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {perm.resource} • {perm.action}
                        </div>
                        {perm.isPublic && (
                          <div className="text-xs text-orange-600 mt-1">⚠️ Public access</div>
                        )}
                      </div>
                      <RiskBadge level={perm.riskLevel} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No risky permissions found</p>
              )}
            </div>
          </div>

          {/* Unused Permissions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Unused Permissions</h3>
              <span className="ml-auto bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-medium">
                {unusedPermissions.length}
              </span>
            </div>
            <div className="space-y-2">
              {unusedPermissions.length > 0 ? (
                unusedPermissions.map((perm) => (
                  <div key={perm.id} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{perm.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {perm.resource} • {perm.action}
                        </div>
                        <div className="text-xs text-yellow-700 mt-1">
                          💤 Last used: {formatDate(perm.lastUsed)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">All permissions are actively used</p>
              )}
            </div>
          </div>
        </div>

        {/* All Permissions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">All Permissions</h3>
            <span className="ml-auto bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
              {user.permissions.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Permission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Resource</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Last Used</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {user.permissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{perm.name}</div>
                      {perm.isPublic && (
                        <div className="text-xs text-orange-600">🌐 Public</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{perm.resource}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{perm.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(perm.lastUsed)}</td>
                    <td className="px-4 py-3">
                      <RiskBadge level={perm.riskLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 className="w-4 h-4" />
              Remove Permission
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <TrendingDown className="w-4 h-4" />
              Downgrade Access
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Mark Safe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

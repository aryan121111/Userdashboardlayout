import { IAMUser, Permission, calculateRiskScore, getRiskLevel } from '../types/iam';

const permissions: { [key: string]: Permission[] } = {
  admin: [
    { id: 'p1', name: 'Full Access', resource: 'All Resources', action: '*', isPublic: false, lastUsed: '2026-04-15', riskLevel: 'High' },
    { id: 'p2', name: 'User Management', resource: 'IAM', action: 'Create, Delete, Update', isPublic: false, lastUsed: '2026-04-14', riskLevel: 'High' },
    { id: 'p3', name: 'Database Admin', resource: 'RDS', action: '*', isPublic: false, lastUsed: '2026-04-10', riskLevel: 'High' },
  ],
  developer: [
    { id: 'p4', name: 'S3 Read/Write', resource: 'S3 Buckets', action: 'Read, Write', isPublic: false, lastUsed: '2026-04-16', riskLevel: 'Low' },
    { id: 'p5', name: 'Lambda Execute', resource: 'Lambda Functions', action: 'Execute', isPublic: false, lastUsed: '2026-04-15', riskLevel: 'Low' },
    { id: 'p6', name: 'CloudWatch Logs', resource: 'CloudWatch', action: 'Read', isPublic: false, lastUsed: '2026-04-17', riskLevel: 'Low' },
  ],
  service: [
    { id: 'p7', name: 'S3 Read', resource: 'S3 Buckets', action: 'Read', isPublic: false, lastUsed: '2026-01-10', riskLevel: 'Medium' },
    { id: 'p8', name: 'DynamoDB Query', resource: 'DynamoDB', action: 'Query, Scan', isPublic: false, lastUsed: '2026-01-15', riskLevel: 'Medium' },
  ],
  publicUser: [
    { id: 'p9', name: 'Public S3 Read', resource: 'S3 Public Bucket', action: 'Read', isPublic: true, lastUsed: '2026-04-12', riskLevel: 'High' },
    { id: 'p10', name: 'API Gateway Access', resource: 'API Gateway', action: 'Execute', isPublic: true, lastUsed: '2026-04-13', riskLevel: 'Medium' },
  ],
  analyst: [
    { id: 'p11', name: 'Read-Only Access', resource: 'All Resources', action: 'Read', isPublic: false, lastUsed: '2026-04-16', riskLevel: 'Low' },
    { id: 'p12', name: 'Billing View', resource: 'Billing', action: 'Read', isPublic: false, lastUsed: '2026-04-14', riskLevel: 'Low' },
  ],
  unused: [
    { id: 'p13', name: 'Legacy S3 Access', resource: 'S3 Archive', action: 'Read, Write', isPublic: false, lastUsed: null, riskLevel: 'Medium' },
    { id: 'p14', name: 'EC2 Management', resource: 'EC2', action: 'Start, Stop', isPublic: false, lastUsed: '2025-12-01', riskLevel: 'Medium' },
  ],
};

const rawUsers: Omit<IAMUser, 'riskScore' | 'riskLevel'>[] = [
  {
    id: '1',
    name: 'Aryan Singh',
    email: 'Aryan.singh@accuknox.com',
    role: 'Admin',
    permissions: permissions.admin,
    lastActive: '2026-04-15',
    accountCreated: '2024-01-15',
  },
  {
    id: '2',
    name: 'API Bot',
    email: 'api-bot@accuknox.com',
    role: 'Service',
    permissions: permissions.service,
    lastActive: '2026-01-17',
    accountCreated: '2023-06-20',
  },
  {
    id: '3',
    name: 'Rohit Pandey',
    email: 'Rohit.Pandey@accuknox.com',
    role: 'User',
    permissions: permissions.developer,
    lastActive: '2026-04-17',
    accountCreated: '2024-03-10',
  },
  {
    id: '4',
    name: 'Public Access User',
    email: 'public@accuknox.com',
    role: 'User',
    permissions: permissions.publicUser,
    lastActive: '2026-04-13',
    accountCreated: '2024-05-22',
  },
  {
    id: '5',
    name: 'Rishav Chaudhary',
    email: 'Rishav.chaudhary@accuknox.com',
    role: 'User',
    permissions: permissions.analyst,
    lastActive: '2026-04-16',
    accountCreated: '2024-02-28',
  },
  {
    id: '6',
    name: 'Legacy System',
    email: 'legacy@accuknox.com',
    role: 'Service',
    permissions: permissions.unused,
    lastActive: '2025-11-30',
    accountCreated: '2022-03-15',
  },
  {
    id: '7',
    name: 'Mohit Kumar',
    email: 'Mohit.kumar@accuknox.com',
    role: 'Admin',
    permissions: permissions.admin,
    lastActive: '2026-04-16',
    accountCreated: '2023-09-01',
  },
  {
    id: '8',
    name: 'Data Analyst Bot',
    email: 'analytics@accuknox.com',
    role: 'Service',
    permissions: permissions.analyst,
    lastActive: '2026-04-17',
    accountCreated: '2024-01-05',
  },
];

// Calculate risk scores for all users
export const mockIAMUsers: IAMUser[] = rawUsers.map(user => {
  const riskScore = calculateRiskScore(user as IAMUser);
  const riskLevel = getRiskLevel(riskScore);
  return {
    ...user,
    riskScore,
    riskLevel,
  };
});

// Calculate stats
export const iamStats = {
  totalUsers: mockIAMUsers.length,
  totalRoles: new Set(mockIAMUsers.map(u => u.role)).size,
  highRiskUsers: mockIAMUsers.filter(u => u.riskLevel === 'High').length,
  unusedPermissions: mockIAMUsers.reduce((count, user) => {
    return count + user.permissions.filter(p => {
      if (!p.lastUsed) return true;
      const daysSince = Math.floor((Date.now() - new Date(p.lastUsed).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 60;
    }).length;
  }, 0),
};
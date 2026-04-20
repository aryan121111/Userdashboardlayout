export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  isPublic: boolean;
  lastUsed: string | null;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface IAMUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Service';
  permissions: Permission[];
  lastActive: string;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  accountCreated: string;
}

export function calculateRiskScore(user: IAMUser): number {
  let score = 0;
  
  // Admin access = +50 risk
  if (user.role === 'Admin') {
    score += 50;
  }
  
  // Check for inactivity (60+ days)
  const lastActiveDate = new Date(user.lastActive);
  const daysSinceActive = Math.floor((Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceActive >= 60) {
    score += 30;
  }
  
  // Check for public access permissions
  const hasPublicAccess = user.permissions.some(p => p.isPublic);
  if (hasPublicAccess) {
    score += 40;
  }
  
  // High-risk permissions (full access, delete, etc.)
  const highRiskPerms = user.permissions.filter(p => 
    p.name.includes('Full Access') || 
    p.action.includes('Delete') ||
    p.action.includes('*')
  );
  score += highRiskPerms.length * 10;
  
  return score;
}

export function getRiskLevel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 80) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export function getDaysSinceDate(dateString: string): number {
  const date = new Date(dateString);
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function SummaryCard({ title, value, icon: Icon, trend, trendUp }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm bg-[#39b7d3b3]">
      <div className="flex items-start justify-between bg-gradient-to-br from-blue-50/50 to-purple-50/30 p-4 rounded-xl backdrop-blur-sm">
        <div>
          <p className="text-sm font-[Abhaya_Libre_SemiBold] text-[#181818]">{title}</p>
          <p className="text-3xl font-semibold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'} font-[Abhaya_Libre_ExtraBold]`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-[#f8d618]">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
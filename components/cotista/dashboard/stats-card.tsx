import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "green" | "blue" | "orange" | "red";
}

const colorClasses = {
  green: {
    bg: "bg-vivant-green/10",
    icon: "text-vivant-green",
    trend: "text-vivant-green"
  },
  blue: {
    bg: "bg-blue-500/10",
    icon: "text-blue-600",
    trend: "text-blue-600"
  },
  orange: {
    bg: "bg-orange-500/10",
    icon: "text-orange-600",
    trend: "text-orange-600"
  },
  red: {
    bg: "bg-red-500/10",
    icon: "text-red-600",
    trend: "text-red-600"
  }
};

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = "green" 
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#1A2F4B]/60 font-medium mb-2">{title}</p>
            <p className="text-3xl font-bold text-[#1A2F4B] mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-[#1A2F4B]/50">{subtitle}</p>
            )}
            {trend && (
              <p className={`text-xs font-medium mt-2 ${trend.positive ? colors.trend : "text-red-600"}`}>
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

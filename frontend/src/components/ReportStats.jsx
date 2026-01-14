import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, BarChart3 } from 'lucide-react';

const iconMap = {
  total_orders: ShoppingCart,
  total_revenue: DollarSign,
  average_order_value: TrendingUp,
  min_order: TrendingDown,
  max_order: TrendingUp,
  default: BarChart3
};

function formatValue(key, value) {
  if (value === null || value === undefined) return 'N/A';

  const numValue = parseFloat(value);

  if (key.includes('revenue') || key.includes('amount') || key.includes('order_value') || key.includes('min_order') || key.includes('max_order')) {
    return `$${numValue.toFixed(2)}`;
  }

  if (Number.isInteger(numValue)) {
    return numValue.toLocaleString();
  }

  return numValue.toFixed(2);
}

function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function ReportStats({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No data to display
      </div>
    );
  }

  const stats = data[0];
  const entries = Object.entries(stats);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([key, value]) => {
        const Icon = iconMap[key] || iconMap.default;

        return (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{formatLabel(key)}</p>
                  <p className="text-2xl font-bold">{formatValue(key, value)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default ReportStats;

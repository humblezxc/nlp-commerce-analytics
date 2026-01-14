import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Loader2
} from 'lucide-react';

const reportTemplates = [
  {
    id: 'sales_summary',
    name: 'Sales Summary',
    description: 'Overview of total sales, revenue, and order counts',
    icon: BarChart3
  },
  {
    id: 'top_products',
    name: 'Top Products',
    description: 'Best selling products by quantity and revenue',
    icon: Package
  },
  {
    id: 'orders_list',
    name: 'Orders List',
    description: 'Detailed list of all orders with customer info',
    icon: ShoppingCart
  },
  {
    id: 'revenue_by_period',
    name: 'Revenue by Period',
    description: 'Revenue breakdown by day, week, or month',
    icon: TrendingUp
  }
];

function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setReportData(null);
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    setReportData(null);

    setTimeout(() => {
      setLoading(false);
      setReportData({ template: selectedTemplate, dateFrom, dateTo });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate reports for your store data</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Report Template</CardTitle>
              <CardDescription>Choose a predefined report type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-lg border text-left transition-colors',
                      selectedTemplate?.id === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <template.icon className={cn(
                      'h-5 w-5 mt-0.5 shrink-0',
                      selectedTemplate?.id === template.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )} />
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {reportData && (
            <Card>
              <CardHeader>
                <CardTitle>Report Results</CardTitle>
                <CardDescription>
                  {reportData.template.name}
                  {reportData.dateFrom && reportData.dateTo && (
                    <span> · {reportData.dateFrom} to {reportData.dateTo}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48 text-muted-foreground border border-dashed rounded-lg">
                  Report visualization will appear here
                </div>
              </CardContent>
            </Card>
          )}

          {!reportData && !loading && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium text-lg">No Report Generated</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a template and click Generate to create a report
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Generating report...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date Range
              </CardTitle>
              <CardDescription>Filter report by date (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full"
                size="lg"
                disabled={!selectedTemplate || loading}
                onClick={handleGenerateReport}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
              {selectedTemplate && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Selected: {selectedTemplate.name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;

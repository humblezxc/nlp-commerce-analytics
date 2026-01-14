import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Loader2,
  MessageSquare,
  Sparkles
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

const exampleQueries = [
  "Show me total sales for the last 7 days",
  "What are my top 5 selling products?",
  "List all orders over $100",
  "Compare revenue this month vs last month",
  "Which customers bought the most?"
];

const MAX_QUERY_LENGTH = 500;

function ReportsPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [nlQuery, setNlQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setReportData(null);
  };

  const handleExampleClick = (query) => {
    setNlQuery(query);
  };

  const handleGenerateReport = async () => {
    const isTemplate = activeTab === 'templates';

    if (isTemplate && !selectedTemplate) return;
    if (!isTemplate && !nlQuery.trim()) return;

    setLoading(true);
    setReportData(null);

    setTimeout(() => {
      setLoading(false);
      setReportData({
        type: isTemplate ? 'template' : 'nlp',
        template: selectedTemplate,
        query: nlQuery,
        dateFrom,
        dateTo
      });
    }, 1500);
  };

  const canGenerate = activeTab === 'templates'
    ? !!selectedTemplate
    : nlQuery.trim().length > 0;

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
              <CardTitle>Create Report</CardTitle>
              <CardDescription>Use a template or describe what you need</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="natural" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Natural Language
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="mt-4">
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
                </TabsContent>

                <TabsContent value="natural" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <textarea
                        placeholder="Describe the report you want to generate..."
                        value={nlQuery}
                        onChange={(e) => setNlQuery(e.target.value.slice(0, MAX_QUERY_LENGTH))}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        <span className={cn(
                          "text-xs",
                          nlQuery.length > MAX_QUERY_LENGTH * 0.9
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}>
                          {nlQuery.length}/{MAX_QUERY_LENGTH}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Try an example:</Label>
                    <div className="flex flex-wrap gap-2">
                      {exampleQueries.map((query, index) => (
                        <button
                          key={index}
                          onClick={() => handleExampleClick(query)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {reportData && (
            <Card>
              <CardHeader>
                <CardTitle>Report Results</CardTitle>
                <CardDescription>
                  {reportData.type === 'template'
                    ? reportData.template.name
                    : `"${reportData.query.slice(0, 50)}${reportData.query.length > 50 ? '...' : ''}"`
                  }
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
                    {activeTab === 'templates'
                      ? 'Select a template and click Generate to create a report'
                      : 'Describe your report and click Generate'
                    }
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
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'natural'
                      ? 'Processing your request with AI...'
                      : 'Generating report...'
                    }
                  </p>
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
                disabled={!canGenerate || loading}
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
              {activeTab === 'templates' && selectedTemplate && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Selected: {selectedTemplate.name}
                </p>
              )}
              {activeTab === 'natural' && nlQuery && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Using AI to interpret your request
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

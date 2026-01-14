import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatHeader(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatCell(key, value) {
  if (value === null || value === undefined) return '-';

  if (key.includes('date')) {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (key.includes('amount') || key.includes('revenue') || key.includes('price')) {
    return `$${parseFloat(value).toFixed(2)}`;
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  return String(value);
}

function ReportTable({ data }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No data to display
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;

    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    aVal = parseFloat(aVal) || 0;
    bVal = parseFloat(bVal) || 0;

    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-2">
                    {formatHeader(col)}
                    {sortKey === col ? (
                      sortDir === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-t transition-colors hover:bg-muted/30',
                  rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                )}
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3">
                    {formatCell(col, row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-muted/30 border-t text-sm text-muted-foreground">
        Showing {sortedData.length} row{sortedData.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default ReportTable;

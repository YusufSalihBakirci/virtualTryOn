import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-xs text-white bg-gray-800 border border-gray-700 rounded-md shadow-lg">
        <p className="label">{`${label}`}</p>
        {payload.map((pld, index) => (
          <div key={index} style={{ color: pld.color }}>
            {formatter(pld.value, pld.name)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardChart = ({ title, description, data, chartType, config }) => {
  const renderChart = () => {
    const commonProps = {
      data: data,
    };

    const tooltipFormatter = (value, name) => {
      if (config.tooltipFormat) {
        return config.tooltipFormat(value, name);
      }
      return [`${value}`, name];
    };

    const ChartComponent = chartType === "line" ? LineChart : BarChart;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey={config.xAxisKey}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={config.yAxisTickFormat}
          />
          <Tooltip
            content={<ChartTooltip formatter={tooltipFormatter} />}
            cursor={{ fill: "rgba(107, 114, 128, 0.1)" }}
          />
          {config.series.map((s) =>
            chartType === "line" ? (
              <Line key={s.dataKey} {...s} />
            ) : (
              <Bar key={s.dataKey} {...s} />
            )
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="bg-gray-800 border border-gray-700 shadow-lg">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-white text-sm sm:text-base">{title}</CardTitle>
        <CardDescription className="text-gray-400 text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="h-48 sm:h-64">{renderChart()}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

const StatCard = ({ title, value, change }) => (
  <Card className="bg-gray-800 border border-gray-700 shadow-lg">
    <CardHeader className="p-3 sm:p-6">
      <CardTitle className="text-white text-sm sm:text-base">{title}</CardTitle>
      <CardDescription className="text-gray-400 text-xs sm:text-sm">
        {value}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-3 sm:p-6 pt-0">
      <span className="text-green-500 text-xs font-semibold">{change}</span>
    </CardContent>
  </Card>
);

export default StatCard;

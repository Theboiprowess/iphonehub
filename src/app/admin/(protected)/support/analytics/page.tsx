"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, MessageSquare, TrendingUp, Users, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function SupportAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/support/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No analytics data available</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Conversations",
      value: analytics.totalConversations || 0,
      icon: MessageSquare,
      change: analytics.conversationChange || "+0%",
      positive: true,
    },
    {
      title: "Questions Answered",
      value: analytics.questionsAnswered || 0,
      icon: CheckCircle,
      change: analytics.answerRate || "0%",
      positive: true,
    },
    {
      title: "Escalated to Human",
      value: analytics.escalated || 0,
      icon: AlertCircle,
      change: analytics.escalationRate || "0%",
      positive: false,
    },
    {
      title: "Unanswered Questions",
      value: analytics.unanswered || 0,
      icon: Clock,
      change: analytics.unansweredChange || "+0%",
      positive: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Support Analytics</h1>
          <p className="text-gray-600">Track AI support performance and customer interactions</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from previous period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Questions</CardTitle>
          <CardDescription>Frequently asked questions customers ask the AI</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topQuestions && analytics.topQuestions.length > 0 ? (
            <div className="space-y-3">
              {analytics.topQuestions.map((q: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.question}</p>
                    <p className="text-xs text-gray-500">{q.count} times asked</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={q.answered ? "default" : "secondary"}>
                      {q.answered ? "Answered" : "Unanswered"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No question data available</p>
          )}
        </CardContent>
      </Card>

      {/* Product Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Product Search Patterns</CardTitle>
          <CardDescription>Most searched products and price ranges</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.productSearches && analytics.productSearches.length > 0 ? (
            <div className="space-y-3">
              {analytics.productSearches.map((search: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{search.product}</p>
                    <p className="text-xs text-gray-500">{search.searchCount} searches</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${search.avgPriceRange}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No product search data available</p>
          )}
        </CardContent>
      </Card>

      {/* Satisfaction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Based on feedback ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Helpful</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${analytics.satisfaction?.helpful || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{analytics.satisfaction?.helpful || 0}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Not Helpful</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${analytics.satisfaction?.notHelpful || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{analytics.satisfaction?.notHelpful || 0}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average AI response time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold">{analytics.avgResponseTime || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-1">seconds</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, variant }: { children: React.ReactNode; variant?: "default" | "secondary" }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      variant === "default" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
    }`}>
      {children}
    </span>
  );
}

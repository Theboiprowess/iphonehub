import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookOpen, HelpCircle, TrendingUp, Users, Clock } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

async function getSupportStats() {
  // This would fetch real stats from the database
  return {
    totalConversations: 0,
    answeredQuestions: 0,
    unansweredQuestions: 0,
    knowledgeArticles: 0,
    avgResponseTime: "0s",
    escalationRate: "0%",
  };
}

export default function SupportDashboard() {
  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Prowess - AI Support Agent"
        subtitle="Manage AI-powered customer support and agent training"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 min-w-0">
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">0</div>
            <p className="text-xs text-[#5F3C18]">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Unanswered Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">0</div>
            <p className="text-xs text-[#5F3C18]">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Knowledge Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">0</div>
            <p className="text-xs text-[#5F3C18]">Published</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">0s</div>
            <p className="text-xs text-[#5F3C18]">AI responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/support/conversations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
              </CardTitle>
              <CardDescription>View and manage customer conversations</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/support/knowledge">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Knowledge Base
              </CardTitle>
              <CardDescription>Manage AI knowledge articles</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/support/unanswered">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Unanswered Questions
              </CardTitle>
              <CardDescription>Review and answer questions AI couldn't handle</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest support conversations and questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Conversations will appear here once customers start using the chat</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

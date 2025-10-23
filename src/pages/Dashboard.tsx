import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Users, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalFirs: number;
  openCases: number;
  totalCriminals: number;
  criticalCases: number;
  solvedCases: number;
  recentActivity: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalFirs: 0,
    openCases: 0,
    totalCriminals: 0,
    criticalCases: 0,
    solvedCases: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        { count: totalFirs },
        { count: openCases },
        { count: totalCriminals },
        { count: criticalCases },
        { count: solvedCases },
        { count: recentActivity },
      ] = await Promise.all([
        supabase.from("firs").select("*", { count: "exact", head: true }),
        supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("criminals").select("*", { count: "exact", head: true }),
        supabase.from("firs").select("*", { count: "exact", head: true }).eq("severity", "critical"),
        supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "solved"),
        supabase.from("firs").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        totalFirs: totalFirs || 0,
        openCases: openCases || 0,
        totalCriminals: totalCriminals || 0,
        criticalCases: criticalCases || 0,
        solvedCases: solvedCases || 0,
        recentActivity: recentActivity || 0,
      });
    } catch (error: any) {
      toast.error("Error loading dashboard stats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total FIRs",
      value: stats.totalFirs,
      icon: FileText,
      description: "All registered complaints",
      color: "text-primary",
    },
    {
      title: "Open Cases",
      value: stats.openCases,
      icon: Briefcase,
      description: "Active investigations",
      color: "text-info",
    },
    {
      title: "Criminals Database",
      value: stats.totalCriminals,
      icon: Users,
      description: "Total records",
      color: "text-muted-foreground",
    },
    {
      title: "Critical Cases",
      value: stats.criticalCases,
      icon: AlertTriangle,
      description: "High priority",
      color: "text-destructive",
    },
    {
      title: "Solved Cases",
      value: stats.solvedCases,
      icon: TrendingUp,
      description: "Successfully closed",
      color: "text-success",
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: Clock,
      description: "Last 7 days",
      color: "text-warning",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Crime Records & Pattern Analysis Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-card border-border shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/firs"
              className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-colors"
            >
              <h3 className="font-semibold text-primary mb-1">Register New FIR</h3>
              <p className="text-sm text-muted-foreground">File a new complaint</p>
            </a>
            <a
              href="/cases"
              className="p-4 bg-info/10 hover:bg-info/20 rounded-lg border border-info/20 transition-colors"
            >
              <h3 className="font-semibold text-info mb-1">View Cases</h3>
              <p className="text-sm text-muted-foreground">Manage investigations</p>
            </a>
            <a
              href="/analytics"
              className="p-4 bg-accent/10 hover:bg-accent/20 rounded-lg border border-accent/20 transition-colors"
            >
              <h3 className="font-semibold text-accent-foreground mb-1">Analytics</h3>
              <p className="text-sm text-muted-foreground">View crime patterns</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
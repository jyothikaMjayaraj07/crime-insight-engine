import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Briefcase, AlertCircle, FileText, Calendar, User } from "lucide-react";

const Cases = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          firs:firs!firs_case_id_fkey(
            id,
            fir_number,
            title,
            crime_type,
            incident_date,
            victim_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error: any) {
      toast.error("Error loading cases");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-success text-success-foreground";
      case "investigating":
        return "bg-info text-info-foreground";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-warning text-warning-foreground";
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading cases...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Cases</h1>
        <p className="text-muted-foreground">Active and Closed Investigations</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cases.map((case_) => (
          <Card key={case_.id} className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{case_.title}</h3>
                    <p className="text-sm text-muted-foreground">Case #{case_.case_number}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(case_.status)}>
                    {case_.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{case_.priority.toUpperCase()}</Badge>
                </div>
              </div>

              {case_.description && (
                <p className="text-foreground mb-4">{case_.description}</p>
              )}

              {case_.firs && case_.firs.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Linked FIRs ({case_.firs.length})
                    </h4>
                    <div className="space-y-2">
                      {case_.firs.map((fir: any) => (
                        <div
                          key={fir.id}
                          className="bg-background/50 rounded-lg p-3 border border-border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-foreground text-sm">{fir.title}</p>
                              <p className="text-xs text-muted-foreground">FIR #{fir.fir_number}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {fir.crime_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(fir.incident_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {fir.victim_name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="text-sm text-muted-foreground mt-4">
                Created: {new Date(case_.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}

        {cases.length === 0 && (
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No cases found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cases;
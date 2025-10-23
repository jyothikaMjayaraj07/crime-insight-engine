import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FolderOpen, FileText } from "lucide-react";

const Evidence = () => {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      const { data, error } = await supabase
        .from("evidence")
        .select("*, cases(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvidence(data || []);
    } catch (error: any) {
      toast.error("Error loading evidence");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading evidence...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Evidence Repository</h1>
        <p className="text-muted-foreground">Case Evidence and Documentation</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {evidence.map((item) => (
          <Card key={item.id} className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{item.description}</h3>
                    <p className="text-sm text-muted-foreground">Evidence #{item.evidence_number}</p>
                  </div>
                </div>
                <Badge variant="outline">{item.evidence_type}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                {item.cases && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Case:</span> {item.cases.title} (#{item.cases.case_number})
                  </div>
                )}
                <div className="text-muted-foreground">
                  <span className="font-medium">Collected:</span>{" "}
                  {new Date(item.collected_date).toLocaleDateString()}
                </div>
                {item.chain_of_custody && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Chain of Custody:</span> {item.chain_of_custody}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {evidence.length === 0 && (
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No evidence records found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Evidence;
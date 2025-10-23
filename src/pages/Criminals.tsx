import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, AlertTriangle } from "lucide-react";

const Criminals = () => {
  const [criminals, setCriminals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCriminals();
  }, []);

  const loadCriminals = async () => {
    try {
      const { data, error } = await supabase
        .from("criminals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCriminals(data || []);
    } catch (error: any) {
      toast.error("Error loading criminals");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading criminals database...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Criminals Database</h1>
        <p className="text-muted-foreground">Criminal Records and Profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criminals.map((criminal) => (
          <Card key={criminal.id} className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{criminal.full_name}</h3>
                    {criminal.alias && (
                      <p className="text-sm text-muted-foreground">Alias: {criminal.alias}</p>
                    )}
                  </div>
                </div>
                {criminal.is_repeat_offender && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Repeat Offender
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {criminal.date_of_birth && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">DOB:</span>{" "}
                    {new Date(criminal.date_of_birth).toLocaleDateString()}
                  </div>
                )}
                {criminal.gender && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Gender:</span> {criminal.gender}
                  </div>
                )}
                {criminal.phone && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Phone:</span> {criminal.phone}
                  </div>
                )}
                {criminal.address && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Address:</span> {criminal.address}
                  </div>
                )}
              </div>

              {criminal.criminal_history && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">History:</span> {criminal.criminal_history}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {criminals.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-gradient-card border-border">
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No criminal records found</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Criminals;
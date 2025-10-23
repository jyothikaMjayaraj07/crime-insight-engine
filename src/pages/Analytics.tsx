import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BarChart3, TrendingUp, MapPin, AlertTriangle } from "lucide-react";

interface CrimeTypeCount {
  crime_type: string;
  count: number;
}

interface AreaCount {
  city: string;
  area: string;
  count: number;
}

const Analytics = () => {
  const [crimeTypes, setCrimeTypes] = useState<CrimeTypeCount[]>([]);
  const [topAreas, setTopAreas] = useState<AreaCount[]>([]);
  const [repeatOffenders, setRepeatOffenders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: firs } = await supabase.from("firs").select("crime_type, location_id, locations(city, area)");

      const typeCounts: Record<string, number> = {};
      const areaCounts: Record<string, { city: string; area: string; count: number }> = {};

      firs?.forEach((fir) => {
        typeCounts[fir.crime_type] = (typeCounts[fir.crime_type] || 0) + 1;

        if (fir.locations) {
          const key = `${fir.locations.city}-${fir.locations.area}`;
          if (!areaCounts[key]) {
            areaCounts[key] = {
              city: fir.locations.city,
              area: fir.locations.area,
              count: 0,
            };
          }
          areaCounts[key].count++;
        }
      });

      const sortedTypes = Object.entries(typeCounts)
        .map(([crime_type, count]) => ({ crime_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const sortedAreas = Object.values(areaCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setCrimeTypes(sortedTypes);
      setTopAreas(sortedAreas);

      const { count } = await supabase
        .from("criminals")
        .select("*", { count: "exact", head: true })
        .eq("is_repeat_offender", true);

      setRepeatOffenders(count || 0);
    } catch (error: any) {
      toast.error("Error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Crime Analytics</h1>
        <p className="text-muted-foreground">Pattern Analysis and Trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Crime Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crimeTypes.map((type, index) => (
                <div key={type.crime_type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{type.crime_type}</span>
                    <span className="text-sm text-muted-foreground">{type.count} cases</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(type.count / (crimeTypes[0]?.count || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {crimeTypes.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No crime data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-info" />
              Crime Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAreas.map((area, index) => (
                <div key={`${area.city}-${area.area}`} className="flex items-center justify-between p-3 bg-info/10 rounded-lg border border-info/20">
                  <div>
                    <div className="font-medium text-foreground">
                      {area.city}, {area.area}
                    </div>
                    <div className="text-sm text-muted-foreground">{area.count} incidents</div>
                  </div>
                  <div className="text-2xl font-bold text-info">#{index + 1}</div>
                </div>
              ))}
              {topAreas.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No location data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Repeat Offenders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-destructive mb-2">{repeatOffenders}</div>
              <p className="text-muted-foreground">Flagged repeat offenders in database</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Most Common Crime</h4>
                <p className="text-sm text-foreground">
                  {crimeTypes[0]?.crime_type || "No data"} with {crimeTypes[0]?.count || 0} reported cases
                </p>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-warning-foreground mb-2">High Activity Area</h4>
                <p className="text-sm text-foreground">
                  {topAreas[0] ? `${topAreas[0].city}, ${topAreas[0].area}` : "No data"} requires increased patrol
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
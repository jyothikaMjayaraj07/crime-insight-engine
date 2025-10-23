import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, FileText, Calendar, MapPin } from "lucide-react";

const FIRs = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firs, setFirs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fir_number: "",
    title: "",
    description: "",
    crime_type: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    incident_date: "",
    victim_name: "",
    victim_contact: "",
    victim_address: "",
    city: "",
    area: "",
  });

  useEffect(() => {
    loadFIRs();
  }, []);

  const loadFIRs = async () => {
    try {
      const { data, error } = await supabase
        .from("firs")
        .select("*, locations(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFirs(data || []);
    } catch (error: any) {
      toast.error("Error loading FIRs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: location, error: locError } = await supabase
        .from("locations")
        .insert({ city: formData.city, area: formData.area })
        .select()
        .single();

      if (locError) throw locError;

      const { error: firError } = await supabase.from("firs").insert({
        fir_number: formData.fir_number,
        title: formData.title,
        description: formData.description,
        crime_type: formData.crime_type,
        severity: formData.severity,
        incident_date: formData.incident_date,
        victim_name: formData.victim_name,
        victim_contact: formData.victim_contact,
        victim_address: formData.victim_address,
        location_id: location.id,
        reported_by: user.id,
      });

      if (firError) throw firError;

      toast.success("FIR registered successfully");
      setShowForm(false);
      setFormData({
        fir_number: "",
        title: "",
        description: "",
        crime_type: "",
        severity: "medium",
        incident_date: "",
        victim_name: "",
        victim_contact: "",
        victim_address: "",
        city: "",
        area: "",
      });
      loadFIRs();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">FIR Management</h1>
          <p className="text-muted-foreground">First Information Reports</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Register New FIR"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gradient-card border-border shadow-lg">
          <CardHeader>
            <CardTitle>Register New FIR</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fir_number">FIR Number *</Label>
                  <Input
                    id="fir_number"
                    value={formData.fir_number}
                    onChange={(e) => setFormData({ ...formData, fir_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident_date">Incident Date *</Label>
                  <Input
                    id="incident_date"
                    type="datetime-local"
                    value={formData.incident_date}
                    onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crime_type">Crime Type *</Label>
                  <Input
                    id="crime_type"
                    value={formData.crime_type}
                    onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="victim_name">Victim Name *</Label>
                  <Input
                    id="victim_name"
                    value={formData.victim_name}
                    onChange={(e) => setFormData({ ...formData, victim_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="victim_contact">Victim Contact</Label>
                  <Input
                    id="victim_contact"
                    value={formData.victim_contact}
                    onChange={(e) => setFormData({ ...formData, victim_contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="victim_address">Victim Address</Label>
                  <Input
                    id="victim_address"
                    value={formData.victim_address}
                    onChange={(e) => setFormData({ ...formData, victim_address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit FIR"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {firs.map((fir) => (
          <Card key={fir.id} className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{fir.title}</h3>
                    <p className="text-sm text-muted-foreground">FIR #{fir.fir_number}</p>
                  </div>
                </div>
                <Badge className={getSeverityColor(fir.severity)}>
                  {fir.severity.toUpperCase()}
                </Badge>
              </div>

              <p className="text-foreground mb-4">{fir.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(fir.incident_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{fir.locations?.city}, {fir.locations?.area}</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium">Victim:</span> {fir.victim_name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {firs.length === 0 && !showForm && (
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No FIRs registered yet</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Register First FIR
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FIRs;
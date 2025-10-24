import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Users, AlertTriangle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const criminalSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100, "Name too long"),
  alias: z.string().trim().max(100).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  identification_marks: z.string().trim().max(500).optional(),
  is_repeat_offender: z.boolean().default(false),
  criminal_history: z.string().trim().max(2000).optional(),
  photo_url: z.string().url().optional().or(z.literal("")),
});

type CriminalFormData = z.infer<typeof criminalSchema>;

const Criminals = () => {
  const [criminals, setCriminals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<CriminalFormData>({
    resolver: zodResolver(criminalSchema),
    defaultValues: {
      full_name: "",
      alias: "",
      date_of_birth: "",
      gender: "",
      phone: "",
      address: "",
      identification_marks: "",
      is_repeat_offender: false,
      criminal_history: "",
      photo_url: "",
    },
  });

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

  const onSubmit = async (data: CriminalFormData) => {
    try {
      const submitData = {
        full_name: data.full_name,
        date_of_birth: data.date_of_birth || null,
        alias: data.alias || null,
        gender: data.gender || null,
        phone: data.phone || null,
        address: data.address || null,
        identification_marks: data.identification_marks || null,
        criminal_history: data.criminal_history || null,
        photo_url: data.photo_url || null,
        is_repeat_offender: data.is_repeat_offender,
      };

      const { error } = await supabase.from("criminals").insert([submitData]);

      if (error) throw error;

      toast.success("Criminal record added successfully");
      form.reset();
      setDialogOpen(false);
      loadCriminals();
    } catch (error: any) {
      toast.error("Failed to add criminal record");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading criminals database...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Criminals Database</h1>
          <p className="text-muted-foreground">Criminal Records and Profiles</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Criminal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Criminal Record</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alias</FormLabel>
                      <FormControl>
                        <Input placeholder="Known alias or nickname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Residential address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identification_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identification Marks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Scars, tattoos, or other identifying features" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="criminal_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Criminal History</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Previous crimes and convictions" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_repeat_offender"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 font-medium">Mark as Repeat Offender</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Criminal
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
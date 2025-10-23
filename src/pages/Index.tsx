import { Button } from "@/components/ui/button";
import { Shield, BarChart3, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground p-6 rounded-full shadow-xl">
              <Shield className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            Crime Records & Analysis System
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Comprehensive Criminal Pattern Analysis for Law Enforcement
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="shadow-xl">
            Access System
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card/95 backdrop-blur p-6 rounded-lg shadow-xl text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-muted-foreground">Crime pattern analysis and trend detection</p>
          </div>
          <div className="bg-card/95 backdrop-blur p-6 rounded-lg shadow-xl text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Database</h3>
            <p className="text-muted-foreground">Centralized criminal records management</p>
          </div>
          <div className="bg-card/95 backdrop-blur p-6 rounded-lg shadow-xl text-center">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-muted-foreground">Role-based access control system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

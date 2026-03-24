import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { User } from "lucide-react";
export const getProfile = () => {
  const data = localStorage.getItem("userProfile");
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return {
        state: "",
        city: ""
      };
    }
  }
  return {
    state: "",
    city: ""
  };
};
const Profile = () => {
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const profile = getProfile();
    setStateName(profile.state || "");
    setCityName(profile.city || "");
  }, []);
  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("userProfile", JSON.stringify({
        state: stateName,
        city: cityName
      }));
      toast({
        title: "Profile Updated",
        description: "Your location preferences have been saved."
      });
      setIsLoading(false);
    }, 500);
  };
  return <DashboardLayout>
            <div className="flex items-start justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-2xl space-y-6">
                    <Card className="shadow-[var(--shadow-monolith)] border-border/60 rounded-xl">
                        <CardHeader className="space-y-1 pb-4 border-b border-border/40">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-heading font-bold text-foreground">Edit Profile</h1>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Update your location to get more tailored portal recommendations.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" placeholder="E.g., Maharashtra" value={stateName} onChange={e => setStateName(e.target.value)} className="rounded-lg" />
                                    <p className="text-xs text-muted-foreground">This helps us find the portals applicable to your state.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="E.g., Mumbai" value={cityName} onChange={e => setCityName(e.target.value)} className="rounded-lg" />
                                    <p className="text-xs text-muted-foreground">This helps us find local portals if provided.</p>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="w-full sm:w-auto rounded-lg" disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>;
};
export default Profile;
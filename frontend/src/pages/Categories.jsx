import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import CategoryGrid from "@/components/CategoryGrid";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const Categories = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories")
  });
  const handleSelect = category => {
    const slug = category.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    navigate(`/dashboard/categories/${slug}`);
  };
  if (isError) {
    toast.error("Failed to load categories");
  }
  return <DashboardLayout>
      <div className="flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl space-y-6">
          <div className="rounded-sm border border-border bg-card p-6 shadow-monolith sm:p-10 space-y-2">
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Categories
            </h1>
            <p className="font-body text-base text-muted-foreground">
              Select a department to explore national/state/local portals and reviews.
            </p>
          </div>

          {isLoading ? <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-primary" strokeWidth={1.5} />
            </div> : <CategoryGrid categories={data || []} onSelect={handleSelect} />}
        </div>
      </div>
    </DashboardLayout>;
};
export default Categories;
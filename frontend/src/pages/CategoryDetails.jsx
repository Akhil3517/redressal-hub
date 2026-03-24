import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Star, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { cn, slugify } from "@/lib/utils";
import { getProfile } from "./Profile";
const levelLabel = {
  national: "National",
  state: "State",
  local: "Local"
};
function asCategoryName(category) {
  if (typeof category === "string") return "Category";
  return category.name;
}
function asCategory(category) {
  if (typeof category === "string") return null;
  return category;
}
const CategoryDetails = () => {
  const {
    categorySlug
  } = useParams();
  const [selectedLevel, setSelectedLevel] = useState("national");
  const {
    data: categories
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories")
  });
  const activeCategory = useMemo(() => (categories || []).find(c => slugify(c.name) === categorySlug), [categories, categorySlug]);
  const categoryId = activeCategory?._id;
  const {
    data: portals,
    isLoading
  } = useQuery({
    queryKey: ["portalsByCategory", categoryId],
    queryFn: () => {
      const profile = getProfile();
      const params = new URLSearchParams();
      if (profile.state) params.append("state", profile.state);
      if (profile.city) params.append("city", profile.city);
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return api.get(`/api/portals/category/${categoryId}${queryString}`);
    },
    enabled: !!categoryId
  });
  const category = useMemo(() => {
    const first = portals?.[0];
    return first ? asCategory(first.category) : null;
  }, [portals]);
  const byLevel = useMemo(() => {
    const all = portals || [];
    const grouped = {
      national: [],
      state: [],
      local: []
    };
    for (const p of all) grouped[p.level].push(p);
    return grouped;
  }, [portals]);
  const levelStats = useMemo(() => {
    const stats = {
      national: {
        count: 0,
        avgRating: 0
      },
      state: {
        count: 0,
        avgRating: 0
      },
      local: {
        count: 0,
        avgRating: 0
      }
    };
    Object.keys(byLevel).forEach(lvl => {
      const list = byLevel[lvl];
      const count = list.length;
      const avgRating = count === 0 ? 0 : Number((list.reduce((s, p) => s + (p.avgRating || 0), 0) / count).toFixed(2));
      stats[lvl] = {
        count,
        avgRating
      };
    });
    return stats;
  }, [byLevel]);
  const visible = byLevel[selectedLevel] || [];
  const categoryTitle = activeCategory?.name || category?.name || (portals?.[0] ? asCategoryName(portals[0].category) : "Category");
  return <DashboardLayout>
      <div className="px-4 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="rounded-sm border border-border bg-card p-6 shadow-monolith sm:p-10 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  {categoryTitle}
                </h1>
                <p className="font-body text-base text-muted-foreground">
                  {category?.description || "Choose a level, then pick a portal to view details and reviews."}
                </p>
              </div>
              <Link to="/dashboard" className="font-heading text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80">
                Back to categories
              </Link>
            </div>
          </div>

          {isLoading ? <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-primary" strokeWidth={1.5} />
            </div> : <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Object.keys(levelLabel).map(lvl => <button key={lvl} onClick={() => setSelectedLevel(lvl)} className={cn("rounded-sm border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-monolith", selectedLevel === lvl && "border-primary ring-1 ring-primary/30")}>
                    <div className="flex items-center justify-between">
                      <div className="font-heading text-sm font-semibold text-foreground">
                        {levelLabel[lvl]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {levelStats[lvl].count} portals
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="font-body">
                        Avg rating: {levelStats[lvl].avgRating || 0}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Explore {levelLabel[lvl].toLowerCase()} portals and reviews
                    </div>
                  </button>)}
              </div>

              <div className="rounded-sm border border-border bg-card p-6 shadow-monolith space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      {levelLabel[selectedLevel]} portals
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Pick one to see portal link, details, and all reviews.
                    </p>
                  </div>
                </div>

                {visible.length === 0 ? <div className="text-sm text-muted-foreground">
                    No portals available for this level yet.
                  </div> : <div className="grid grid-cols-1 gap-3">
                    {visible.map(p => <Link key={p._id} to={`/dashboard/portals/${p._id}`} className="group rounded-sm border border-border bg-background p-5 transition-all hover:border-primary hover:shadow-monolith">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="font-heading text-base font-semibold text-foreground">
                              {p.portalName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {[p.city, p.state].filter(Boolean).join(", ") || "—"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-primary" />
                            <span>{p.avgRating || 0}</span>
                            <span className="text-xs">({p.totalReviews || 0})</span>
                          </div>
                        </div>

                        {p.description && <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
                            {p.description}
                          </div>}

                        {p.bestUsedFor && p.bestUsedFor.length > 0 && <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-semibold">Best used for: </span>
                            {p.bestUsedFor.slice(0, 2).join("; ")}
                            {p.bestUsedFor.length > 2 && "…"}
                          </div>}

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                          View portal details
                          <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </Link>)}
                  </div>}
              </div>
            </>}
        </div>
      </div>
    </DashboardLayout>;
};
export default CategoryDetails;
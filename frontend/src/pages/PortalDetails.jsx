import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
function categorySlugFromPortal(portal) {
  if (!portal) return null;
  if (typeof portal.category === "string") return null;
  return slugify(portal.category.name);
}
const PortalDetails = () => {
  const {
    portalId
  } = useParams();
  const qc = useQueryClient();
  const {
    data: portal,
    isLoading: portalLoading
  } = useQuery({
    queryKey: ["portal", portalId],
    queryFn: () => api.get(`/api/portals/${portalId}`),
    enabled: !!portalId
  });
  const {
    data: reviews,
    isLoading: reviewsLoading
  } = useQuery({
    queryKey: ["reviews", portalId],
    queryFn: () => api.get(`/api/reviews/${portalId}`),
    enabled: !!portalId
  });
  const [form, setForm] = useState({
    rating: 5,
    responseTimeRating: 4,
    usabilityRating: 4,
    reviewText: ""
  });
  const createReview = useMutation({
    mutationFn: payload => api.post("/api/reviews", payload),
    onSuccess: async () => {
      toast.success("Review submitted");
      setForm(p => ({
        ...p,
        reviewText: ""
      }));
      await qc.invalidateQueries({
        queryKey: ["reviews", portalId]
      });
      await qc.invalidateQueries({
        queryKey: ["portal", portalId]
      });
      const catId = portal && typeof portal.category !== "string" ? portal.category._id : null;
      if (catId) await qc.invalidateQueries({
        queryKey: ["portalsByCategory", catId]
      });
    },
    onError: err => {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    }
  });
  const categoryLink = useMemo(() => {
    const slug = categorySlugFromPortal(portal);
    return slug ? `/dashboard/categories/${slug}` : "/dashboard";
  }, [portal]);
  const submit = e => {
    e.preventDefault();
    if (!portalId) return;
    createReview.mutate({
      portalId,
      rating: Number(form.rating),
      responseTimeRating: Number(form.responseTimeRating),
      usabilityRating: Number(form.usabilityRating),
      reviewText: form.reviewText?.trim() || undefined
    });
  };
  return <DashboardLayout>
      <div className="px-4 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="rounded-sm border border-border bg-card p-6 shadow-monolith sm:p-10 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  {portalLoading ? "Loading..." : portal?.portalName || "Portal"}
                </h1>
                <p className="font-body text-base text-muted-foreground">
                  {portal?.description || "Portal details and community reviews."}
                </p>
              </div>
              <Link to={categoryLink} className="font-heading text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80">
                Back
              </Link>
            </div>
          </div>

          {portalLoading || !portal ? <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-primary" strokeWidth={1.5} />
            </div> : <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-sm border border-border bg-card p-6 shadow-monolith space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {[portal.city, portal.state].filter(Boolean).join(", ") || "—"} · {portal.level.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="font-body">
                          {portal.avgRating || 0} avg · {portal.totalReviews || 0} reviews
                        </span>
                      </div>
                    </div>
                    <a href={portal.portalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-heading text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                      Open portal
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-sm border border-border bg-background p-4">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
                        Portal URL
                      </div>
                      <div className="mt-1 text-sm text-foreground break-all">
                        {portal.portalUrl}
                      </div>
                    </div>

                    {portal.howToUse && portal.howToUse.length > 0 && <div className="rounded-sm border border-border bg-background p-4 space-y-2">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
                          How to use
                        </div>
                        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-foreground">
                          {portal.howToUse.map((step, idx) => <li key={idx}>{step}</li>)}
                        </ol>
                      </div>}

                    {portal.bestUsedFor && portal.bestUsedFor.length > 0 && <div className="rounded-sm border border-border bg-background p-4 space-y-2">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
                          Best used for
                        </div>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-foreground">
                          {portal.bestUsedFor.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>}
                  </div>
                </div>

                <div className="rounded-sm border border-border bg-card p-6 shadow-monolith space-y-4">
                  <h2 className="font-heading text-base font-bold text-foreground">
                    Add a review
                  </h2>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[{
                    key: "rating",
                    label: "Overall"
                  }, {
                    key: "responseTimeRating",
                    label: "Response"
                  }, {
                    key: "usabilityRating",
                    label: "Usability"
                  }].map(({
                    key,
                    label
                  }) => <div key={key} className="space-y-2">
                          <Label className="text-xs">{label}</Label>
                          <Input type="number" min={1} max={5} value={form[key]} onChange={e => setForm(p => ({
                      ...p,
                      [key]: Number(e.target.value)
                    }))} />
                        </div>)}
                    </div>

                    <div className="space-y-2">
                      <Label>Review</Label>
                      <Textarea value={form.reviewText} onChange={e => setForm(p => ({
                    ...p,
                    reviewText: e.target.value
                  }))} placeholder="Share your experience..." rows={4} />
                    </div>

                    <Button type="submit" className="w-full" disabled={createReview.isPending}>
                      {createReview.isPending ? <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                        </span> : "Submit review"}
                    </Button>
                  </form>
                </div>
              </div>

              <div className="rounded-sm border border-border bg-card p-6 shadow-monolith space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-heading text-lg font-bold text-foreground">Reviews</h2>
                  <div className="text-sm text-muted-foreground">
                    {portal.totalReviews || 0} total
                  </div>
                </div>

                {reviewsLoading ? <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-primary" strokeWidth={1.5} />
                  </div> : reviews && reviews.length > 0 ? <div className="space-y-3">
                    {reviews.map(r => <div key={r._id} className="rounded-sm border border-border bg-background p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-primary" />
                            <span className="text-foreground font-medium">{r.rating}</span>
                            <span className="text-xs">
                              Response {r.responseTimeRating} · Usability {r.usabilityRating}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {r.reviewText && <div className="mt-3 text-sm text-foreground whitespace-pre-wrap">
                            {r.reviewText}
                          </div>}
                      </div>)}
                  </div> : <div className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this portal.
                  </div>}
              </div>
            </>}
        </div>
      </div>
    </DashboardLayout>;
};
export default PortalDetails;
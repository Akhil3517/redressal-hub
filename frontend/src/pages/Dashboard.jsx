import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, FileText, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import QueryBox from "@/components/QueryBox";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { getProfile } from "./Profile";
const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [copied, setCopied] = useState(false);
  const analyzeMutation = useMutation({
    mutationFn: payload => api.post("/api/ai/analyze-query", payload),
    onSuccess: data => {
      setResult(data);
      setComplaint(null);
    },
    onError: () => toast.error("Failed to analyze query. Please try again.")
  });
  const complaintMutation = useMutation({
    mutationFn: payload => api.post("/api/ai/generate-complaint", payload),
    onSuccess: data => setComplaint(data.complaint),
    onError: () => toast.error("Failed to generate complaint. Please try again.")
  });
  const handleQueryChange = useCallback(q => {
    setQuery(q);
    if (result) {
      setResult(null);
      setComplaint(null);
    }
  }, [result]);
  const handleAnalyze = () => {
    if (!query.trim()) return;
    setResult(null);
    setComplaint(null);
    const profile = getProfile();
    analyzeMutation.mutate({
      query,
      state: profile.state,
      city: profile.city
    });
  };
  const handleGenerateComplaint = () => {
    if (!result) return;
    complaintMutation.mutate({
      query: result.query,
      portalName: result.portal?.portalName,
      category: result.categoryName,
      level: result.level,
      state: result.state,
      city: result.city,
      reason: result.reason
    });
  };
  const handleCopyComplaint = () => {
    if (!complaint) return;
    navigator.clipboard.writeText(complaint).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const handleReset = () => {
    setQuery("");
    setResult(null);
    setComplaint(null);
  };
  const isLoading = analyzeMutation.isPending;
  const showInputs = !isLoading && !result;
  return <DashboardLayout>
      <div className="flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          <div className="rounded-sm border border-border bg-card p-6 shadow-monolith sm:p-10 space-y-6">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Ask Your Query
              </h1>
              <p className="font-body text-base text-muted-foreground">
                Describe your issue and we will suggest the correct portal.
              </p>
              <div className="pt-2">
                <Link to="/dashboard" className="font-heading text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80">
                  Browse categories instead
                </Link>
              </div>
            </div>

            <QueryBox query={query} onQueryChange={handleQueryChange} onAnalyze={handleAnalyze} isLoading={isLoading} isVisible={showInputs} />

            {isLoading && <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-primary" strokeWidth={1.5} />
              </div>}

            {result && result.portal && <div className="space-y-4 mt-4">
                <div className="rounded-sm border border-border bg-card p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
                    Recommended portal
                  </div>
                  <div className="font-heading text-lg font-bold text-foreground">
                    {result.portal.portalName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.reason}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Level: {result.level.toUpperCase()}
                    {result.state ? ` · ${result.state}` : ""}
                    {result.city ? ` · ${result.city}` : ""}
                    {result.categoryName ? ` · ${result.categoryName}` : ""}
                  </div>
                </div>

                {result.steps && result.steps.length > 0 && <div className="rounded-sm border border-border bg-card p-4 space-y-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
                      Steps to raise complaint
                    </div>
                    <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-foreground">
                      {result.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                    </ol>
                  </div>}

                {/* Complaint Draft Section */}
                <div className="rounded-sm border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="text-xs uppercase tracking-wider text-primary font-heading font-semibold">
                      Complaint Draft Generator
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Need help writing a formal complaint? Let AI draft one for you based on your grievance.
                  </p>

                  {!complaint && <button onClick={handleGenerateComplaint} disabled={complaintMutation.isPending} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-heading text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                      {complaintMutation.isPending ? <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating…
                        </> : <>
                          <FileText className="h-4 w-4" />
                          Generate Complaint Letter
                        </>}
                    </button>}

                  {complaint && <div className="space-y-3">
                      <p className="text-xs text-muted-foreground italic">
                        You can edit the letter below before copying.
                      </p>
                      <textarea value={complaint} onChange={e => setComplaint(e.target.value)} rows={18} className="w-full rounded-sm border border-border bg-background p-4 font-body text-sm text-foreground leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-primary" spellCheck />
                      <div className="flex items-center gap-3">
                        <button onClick={handleCopyComplaint} className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 font-heading text-sm font-medium text-primary hover:bg-accent/40 transition-colors">
                          {copied ? <><Check className="h-4 w-4 text-green-500" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy to Clipboard</>}
                        </button>
                        <button onClick={handleGenerateComplaint} disabled={complaintMutation.isPending} className="font-heading text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50">
                          Regenerate
                        </button>
                      </div>
                    </div>}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a href={result.portal.portalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-heading text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                    Open portal website
                  </a>
                  <Link to={`/dashboard/portals/${result.portal._id}`} className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 font-heading text-sm font-medium text-primary hover:bg-accent/40">
                    View details & reviews
                  </Link>
                  <button onClick={handleReset} className="ml-auto font-heading text-sm font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-70">
                    Ask another query
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default Dashboard;
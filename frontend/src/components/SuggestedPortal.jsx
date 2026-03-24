import { ExternalLink } from "lucide-react";
const SuggestedPortal = ({
  result,
  isVisible
}) => {
  return <div className={`transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 max-h-[300px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
      <div className="rounded-sm border border-border bg-accent p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-sm bg-primary px-3 py-1 font-heading text-xs font-semibold text-primary-foreground">
            {result.category}
          </span>
          <span className="font-heading text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Suggested Portal
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-foreground">
          {result.portalName}
        </h3>

        <a href={result.portalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-heading text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Open Portal
          <ExternalLink size={16} strokeWidth={1.5} />
        </a>
      </div>
    </div>;
};
export default SuggestedPortal;
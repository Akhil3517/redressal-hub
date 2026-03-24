import { Landmark, Shield, Zap, Droplets, Construction, Trash2, FileText, LayoutGrid } from "lucide-react";
const iconForCategory = name => {
  const key = name.toLowerCase();
  if (key.includes("municipal")) return Landmark;
  if (key.includes("police")) return Shield;
  if (key.includes("electric")) return Zap;
  if (key.includes("water")) return Droplets;
  if (key.includes("road")) return Construction;
  if (key.includes("sanitation")) return Trash2;
  if (key.includes("document")) return FileText;
  return LayoutGrid;
};
const CategoryGrid = ({
  categories,
  onSelect
}) => {
  return <div className="space-y-4">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Available Categories
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map(cat => {
        const Icon = iconForCategory(cat.name);
        return <button key={cat._id} onClick={() => onSelect(cat)} className="group flex flex-col items-center gap-3 rounded-sm border border-border bg-card p-5 transition-all duration-200 hover:border-primary hover:shadow-monolith">
              <Icon size={24} strokeWidth={1.5} className="text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="font-heading text-xs font-semibold text-foreground text-center">
                {cat.name}
              </span>
            </button>;
      })}
      </div>
    </div>;
};
export default CategoryGrid;
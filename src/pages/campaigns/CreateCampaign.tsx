import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Gift,
  FileText,
  Eye,
  Search,
  ShoppingBag,
  Package,
  ExternalLink,
} from "lucide-react";

// ─── Step labels ───
const STEP_LABELS = ["Brief", "Compensation & Creators"];

function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isComplete = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isPast = stepNum <= currentStep;
        return (
          <div key={i} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (stepNum < currentStep) onStepClick(stepNum);
              }}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all"
              style={{
                backgroundColor: isCurrent
                  ? "var(--brand-100)"
                  : isComplete
                    ? "var(--brand-0)"
                    : "transparent",
                cursor: stepNum < currentStep ? "pointer" : "default",
              }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: isComplete
                    ? "var(--brand-700)"
                    : isCurrent
                      ? "var(--brand-700)"
                      : "var(--neutral-200)",
                  color: isPast ? "white" : "var(--neutral-500)",
                }}
              >
                {isComplete ? <Check className="size-3.5" /> : stepNum}
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{
                  color: isCurrent
                    ? "var(--brand-700)"
                    : isComplete
                      ? "var(--brand-600)"
                      : "var(--neutral-400)",
                }}
              >
                {STEP_LABELS[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div
                className="h-px w-10"
                style={{
                  backgroundColor: isComplete ? "var(--brand-300)" : "var(--neutral-200)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Prefilled content (brand-side "28 Litsea" demo data) ───

const PREFILLED_BRAND_DESCRIPTION =
  "28 Litsea is a clean beauty brand creating mindful skincare powered by natural botanicals. We believe in transparency, sustainability, and products that actually work — no fillers, no compromises.";

const PREFILLED_CAMPAIGN_DESCRIPTION =
  "Create engaging content showcasing our new Summer Glow Collection. We want authentic, creative content that highlights the product benefits and your personal skincare routine.";

interface PlatformRequirement {
  id: string;
  text: string;
}

const DEFAULT_PLATFORM_REQUIREMENTS: PlatformRequirement[] = [
  { id: "pr-1", text: "Create 1 TikTok video (30–60 seconds) showcasing the product" },
  { id: "pr-2", text: "Create 1 Instagram Reel featuring the product in your skincare routine" },
];

interface OtherRequirement {
  id: string;
  text: string;
}

const DEFAULT_OTHER_REQUIREMENTS: OtherRequirement[] = [
  { id: "or-1", text: "Use campaign hashtag #28Litsea #SummerGlow" },
  { id: "or-2", text: "Tag @28litsea in all posts" },
  { id: "or-3", text: "Show product in use (not just unboxing)" },
];

const PREFILLED_TERMS =
  "You agree to deliver the content described above. All content must be submitted for review before publishing. You agree to keep the product and campaign details confidential until publication. UGC rights granted for 90 days across brand channels.";

// ─── Mock Shopify products (simulating what the Shopify API would return) ───
interface ShopifyProduct {
  id: string;
  title: string;
  image: string;
  price: string;
  variant: string;
  inventory: number;
  handle: string;
}

const MOCK_SHOPIFY_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/8012345",
    title: "Summer Glow Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop",
    price: "$42.00",
    variant: "30ml",
    inventory: 145,
    handle: "summer-glow-serum",
  },
  {
    id: "gid://shopify/Product/8012346",
    title: "Melted Balm",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=80&h=80&fit=crop",
    price: "$35.00",
    variant: "15g",
    inventory: 230,
    handle: "melted-balm",
  },
  {
    id: "gid://shopify/Product/8012347",
    title: "Botanical Face Mist",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop",
    price: "$28.00",
    variant: "100ml",
    inventory: 89,
    handle: "botanical-face-mist",
  },
  {
    id: "gid://shopify/Product/8012348",
    title: "Litsea Body Oil",
    image: "https://images.unsplash.com/photo-1600428877878-1a0ff561972c?w=80&h=80&fit=crop",
    price: "$55.00",
    variant: "200ml",
    inventory: 62,
    handle: "litsea-body-oil",
  },
  {
    id: "gid://shopify/Product/8012349",
    title: "Clean Glow SPF 30",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=80&h=80&fit=crop",
    price: "$38.00",
    variant: "50ml",
    inventory: 178,
    handle: "clean-glow-spf-30",
  },
  {
    id: "gid://shopify/Product/8012350",
    title: "Overnight Repair Mask",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop",
    price: "$48.00",
    variant: "50ml",
    inventory: 95,
    handle: "overnight-repair-mask",
  },
];

// ─── Shopify Product Picker Modal (simulates Shopify App Bridge ResourcePicker) ───
function ShopifyProductPicker({
  isOpen,
  onClose,
  onSelect,
  selectedIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: ShopifyProduct[]) => void;
  selectedIds: Set<string>;
}) {
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<Set<string>>(new Set(selectedIds));

  if (!isOpen) return null;

  const filtered = MOCK_SHOPIFY_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    setTempSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = MOCK_SHOPIFY_PRODUCTS.filter((p) => tempSelected.has(p.id));
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-[var(--brand-700)]" />
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Select Products</h3>
            <Badge className="border-0 bg-[var(--green-100)] text-[var(--green-700)] text-[10px] gap-1">
              <ExternalLink className="size-2.5" /> Shopify
            </Badge>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[var(--neutral-100)] transition-colors">
            <X className="size-4 text-[var(--neutral-500)]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--neutral-400)]" />
            <input
              className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] outline-none focus:border-[var(--brand-700)] focus:ring-1 focus:ring-[var(--brand-700)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Product list */}
        <div className="max-h-[360px] overflow-y-auto px-2 py-2">
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--neutral-400)]">
              No products match your search.
            </div>
          )}
          {filtered.map((product) => {
            const isSelected = tempSelected.has(product.id);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-[var(--neutral-50)]"
                style={{
                  backgroundColor: isSelected ? "var(--brand-0)" : "transparent",
                }}
              >
                {/* Checkbox */}
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--brand-700)" : "white",
                    border: isSelected ? "none" : "1.5px solid var(--neutral-300)",
                  }}
                >
                  {isSelected && <Check className="size-3 text-white" />}
                </div>

                {/* Product image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-11 w-11 rounded-lg object-cover border"
                  style={{ borderColor: "var(--border)" }}
                />

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--neutral-800)] truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-[var(--neutral-500)]">
                    {product.variant} · {product.inventory} in stock
                  </p>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold text-[var(--neutral-700)] shrink-0">
                  {product.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-5 py-3" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs text-[var(--neutral-500)]">
            {tempSelected.size} product{tempSelected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={tempSelected.size === 0}
              style={{ backgroundColor: "var(--brand-700)", color: "white" }}
            >
              Add Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 1 — Campaign Brief
// ═══════════════════════════════════════════════════
interface BriefDraft {
  brandDescription: string;
  campaignDescription: string;
  platformRequirements: PlatformRequirement[];
  otherRequirements: OtherRequirement[];
  terms: string;
}

function StepBrief({
  draft,
  setDraft,
}: {
  draft: BriefDraft;
  setDraft: React.Dispatch<React.SetStateAction<BriefDraft>>;
}) {
  const [newPlatReq, setNewPlatReq] = useState("");
  const [newOtherReq, setNewOtherReq] = useState("");

  const addPlatformReq = () => {
    if (!newPlatReq.trim()) return;
    setDraft((prev) => ({
      ...prev,
      platformRequirements: [
        ...prev.platformRequirements,
        { id: `pr-${Date.now()}`, text: newPlatReq.trim() },
      ],
    }));
    setNewPlatReq("");
  };

  const removePlatformReq = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      platformRequirements: prev.platformRequirements.filter((r) => r.id !== id),
    }));
  };

  const addOtherReq = () => {
    if (!newOtherReq.trim()) return;
    setDraft((prev) => ({
      ...prev,
      otherRequirements: [
        ...prev.otherRequirements,
        { id: `or-${Date.now()}`, text: newOtherReq.trim() },
      ],
    }));
    setNewOtherReq("");
  };

  const removeOtherReq = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      otherRequirements: prev.otherRequirements.filter((r) => r.id !== id),
    }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Live preview hint */}
      <div className="flex items-center gap-2 rounded-lg border border-[var(--brand-200)] bg-[var(--brand-0)] px-4 py-3">
        <Eye className="size-4 text-[var(--brand-700)] shrink-0" />
        <p className="text-sm text-[var(--brand-700)]">
          This is what creators will see when they receive your campaign invite. All fields are pre-filled — edit anything to customize.
        </p>
      </div>

      {/* ── About the Brand ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">About Your Brand</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            A short intro so creators understand who you are. 2–3 lines.
          </p>
        </div>
        <textarea
          className="flex min-h-[90px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
          value={draft.brandDescription}
          onChange={(e) => setDraft((prev) => ({ ...prev, brandDescription: e.target.value }))}
          placeholder="Tell creators about your brand in 2–3 sentences..."
        />
      </section>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* ── About This Campaign ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">About This Campaign</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            What should creators know about this specific campaign? 2–3 lines.
          </p>
        </div>
        <textarea
          className="flex min-h-[90px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
          value={draft.campaignDescription}
          onChange={(e) => setDraft((prev) => ({ ...prev, campaignDescription: e.target.value }))}
          placeholder="Describe the campaign goal, creative direction, and product..."
        />
      </section>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* ── Platform Requirements ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">Platform Requirements</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            What content should creators produce? These are shown as checklist items in the brief.
          </p>
        </div>
        <div className="space-y-2">
          {draft.platformRequirements.map((req) => (
            <div
              key={req.id}
              className="group flex items-start gap-3 rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-3"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-400)] bg-[var(--brand-100)]">
                <Check className="size-3 text-[var(--brand-700)]" />
              </div>
              <span className="flex-1 text-sm text-[var(--neutral-700)] leading-relaxed">
                {req.text}
              </span>
              <button
                type="button"
                onClick={() => removePlatformReq(req.id)}
                className="shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--neutral-100)]"
              >
                <X className="size-3.5 text-[var(--neutral-400)]" />
              </button>
            </div>
          ))}
        </div>
        {/* Add new */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-50)] px-4 py-2.5">
            <Plus className="size-4 text-[var(--neutral-400)]" />
            <input
              className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
              placeholder="Add a platform requirement..."
              value={newPlatReq}
              onChange={(e) => setNewPlatReq(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addPlatformReq(); }
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
            onClick={addPlatformReq}
            disabled={!newPlatReq.trim()}
          >
            Add
          </Button>
        </div>
      </section>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* ── Other Requirements ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">Other Requirements</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            Additional rules or guidelines for creators to follow.
          </p>
        </div>
        <div className="space-y-2">
          {draft.otherRequirements.map((req) => (
            <div
              key={req.id}
              className="group flex items-start gap-3 rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-3"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-400)] bg-[var(--brand-100)]">
                <Check className="size-3 text-[var(--brand-700)]" />
              </div>
              <span className="flex-1 text-sm text-[var(--neutral-700)] leading-relaxed">
                {req.text}
              </span>
              <button
                type="button"
                onClick={() => removeOtherReq(req.id)}
                className="shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--neutral-100)]"
              >
                <X className="size-3.5 text-[var(--neutral-400)]" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-50)] px-4 py-2.5">
            <Plus className="size-4 text-[var(--neutral-400)]" />
            <input
              className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
              placeholder="Add another requirement..."
              value={newOtherReq}
              onChange={(e) => setNewOtherReq(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addOtherReq(); }
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
            onClick={addOtherReq}
            disabled={!newOtherReq.trim()}
          >
            Add
          </Button>
        </div>
      </section>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* ── Terms & Commitments ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">Terms & Commitments</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            Pre-filled standard terms. Edit to customize for this campaign.
          </p>
        </div>
        <textarea
          className="flex min-h-[100px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
          value={draft.terms}
          onChange={(e) => setDraft((prev) => ({ ...prev, terms: e.target.value }))}
          placeholder="Enter terms and commitments..."
        />
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 2 — Gifted Product (Shopify) & Creator Preferences
// ═══════════════════════════════════════════════════
interface CompensationDraft {
  selectedProducts: ShopifyProduct[];
  creatorDescription: string;
}

function StepCompensation({
  draft,
  setDraft,
}: {
  draft: CompensationDraft;
  setDraft: React.Dispatch<React.SetStateAction<CompensationDraft>>;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleProductSelect = (products: ShopifyProduct[]) => {
    setDraft((prev) => ({ ...prev, selectedProducts: products }));
  };

  const removeProduct = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((p) => p.id !== id),
    }));
  };

  const selectedIds = new Set(draft.selectedProducts.map((p) => p.id));

  // Total estimated value
  const totalValue = draft.selectedProducts.reduce((sum, p) => {
    const price = parseFloat(p.price.replace("$", ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* ── Gifted Product — Shopify Integration ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-100)]">
            <Gift className="size-5 text-[var(--brand-700)]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Gifted Product</h3>
            <p className="text-xs text-[var(--neutral-400)]">
              Select products from your Shopify store to gift to creators.
            </p>
          </div>
        </div>

        {/* Shopify connection status */}
        <div className="flex items-center gap-2 rounded-lg border border-[var(--green-300)] bg-[var(--green-100)] px-4 py-2.5">
          <ShoppingBag className="size-4 text-[var(--green-700)]" />
          <span className="text-sm font-medium text-[var(--green-700)]">Connected to Shopify</span>
          <span className="text-xs text-[var(--green-600)]">· 28litsea.myshopify.com</span>
        </div>

        {/* Selected products */}
        {draft.selectedProducts.length > 0 && (
          <div className="space-y-2">
            {draft.selectedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex items-center gap-3 rounded-xl border border-[var(--neutral-200)] bg-white p-3 transition-all hover:border-[var(--brand-300)]"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-12 w-12 rounded-lg object-cover border"
                  style={{ borderColor: "var(--border)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--neutral-800)] truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-[var(--neutral-500)]">
                    {product.variant} · {product.inventory} in stock
                  </p>
                </div>
                <span className="text-sm font-semibold text-[var(--neutral-700)] shrink-0">
                  {product.price}
                </span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="shrink-0 rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--neutral-100)]"
                >
                  <X className="size-3.5 text-[var(--neutral-400)]" />
                </button>
              </div>
            ))}

            {/* Total value summary */}
            <div className="flex items-center justify-between rounded-lg bg-[var(--brand-0)] px-4 py-2.5 border border-[var(--brand-200)]">
              <span className="text-xs font-medium text-[var(--brand-700)]">
                <Package className="inline size-3.5 mr-1" />
                {draft.selectedProducts.length} product{draft.selectedProducts.length !== 1 ? "s" : ""} selected
              </span>
              <span className="text-sm font-bold text-[var(--brand-700)]">
                Est. value: ${totalValue.toFixed(2)}/creator
              </span>
            </div>
          </div>
        )}

        {/* Add products button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          className="w-full gap-2 border-dashed border-[var(--neutral-300)] text-[var(--neutral-600)] hover:border-[var(--brand-400)] hover:text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
        >
          <Plus className="size-4" />
          {draft.selectedProducts.length > 0 ? "Change Products" : "Select Products from Shopify"}
        </Button>
      </section>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* ── Creator Preferences (free-form) ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">Who Are You Looking For?</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            Describe your ideal creator. Be as specific or broad as you'd like.
          </p>
        </div>
        <textarea
          className="flex min-h-[140px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
          value={draft.creatorDescription}
          onChange={(e) => setDraft((prev) => ({ ...prev, creatorDescription: e.target.value }))}
          placeholder={"Geography preference (e.g., US-based, UK-based)\nFollower range (e.g., 1K–10K nano creators)\nContent style (e.g., aesthetic flat-lays, talking-head reviews)\nNiche (e.g., clean beauty, skincare, wellness)\nAudience demographics (e.g., women 18–34)\nPlatform focus (e.g., primarily TikTok creators)"}
        />
      </section>

      {/* Shopify Product Picker Modal */}
      <ShopifyProductPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleProductSelect}
        selectedIds={selectedIds}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [briefDraft, setBriefDraft] = useState<BriefDraft>({
    brandDescription: PREFILLED_BRAND_DESCRIPTION,
    campaignDescription: PREFILLED_CAMPAIGN_DESCRIPTION,
    platformRequirements: [...DEFAULT_PLATFORM_REQUIREMENTS],
    otherRequirements: [...DEFAULT_OTHER_REQUIREMENTS],
    terms: PREFILLED_TERMS,
  });

  // Step 2 state
  const [compDraft, setCompDraft] = useState<CompensationDraft>({
    selectedProducts: [],
    creatorDescription: "",
  });

  const totalSteps = 2;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLaunch = () => {
    navigate("/campaigns");
  };

  const canAdvance = step === 1
    ? briefDraft.brandDescription.trim().length > 0 && briefDraft.campaignDescription.trim().length > 0
    : compDraft.selectedProducts.length > 0;

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="border-b border-[var(--neutral-200)] bg-white px-8 py-5">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--neutral-800)]">Create Campaign Brief</h1>
              <p className="text-sm text-[var(--neutral-500)]">
                Set up what creators will see when they're invited to your campaign.
              </p>
            </div>
            <Badge className="border-[var(--neutral-200)] bg-white text-[var(--neutral-600)] text-xs">
              <FileText className="size-3 mr-1" />
              Draft
            </Badge>
          </div>
          <StepIndicator
            currentStep={step}
            totalSteps={totalSteps}
            onStepClick={setStep}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 pb-32">
        {step === 1 && <StepBrief draft={briefDraft} setDraft={setBriefDraft} />}
        {step === 2 && <StepCompensation draft={compDraft} setDraft={setCompDraft} />}
      </div>

      {/* Footer navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--neutral-200)] bg-white/95 backdrop-blur-sm px-8 py-4 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Button
            variant="outline"
            onClick={step === 1 ? () => navigate("/campaigns") : handleBack}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <div className="text-xs text-[var(--neutral-400)]">
            Step {step} of {totalSteps}
          </div>

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canAdvance}
              className="gap-2"
              style={{
                backgroundColor: "var(--brand-700)",
                color: "white",
              }}
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              disabled={!canAdvance}
              className="gap-2"
              style={{
                backgroundColor: "var(--brand-700)",
                color: "white",
              }}
            >
              Launch Campaign
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

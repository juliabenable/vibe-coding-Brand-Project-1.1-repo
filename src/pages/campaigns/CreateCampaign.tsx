import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Gift,
  CreditCard,
  DollarSign,
  TrendingUp,
  Tag,
  Lock,
  Zap,
  FileText,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CompensationType,
  type CompensationConfig,
  defaultCompensationTypes,
  GATED_COMPENSATION_TYPES,
} from "@/store/campaign-store";

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
  "Content must be original and not previously published. Brand reserves the right to request one round of revisions within 48 hours. UGC rights granted for 90 days across brand channels. Posting must occur within the campaign flight window.";

// ─── Compensation tile config ───
const COMPENSATION_TILES: {
  type: CompensationType;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}[] = [
  { type: "gifted", label: "Gifted Product", icon: Gift, color: "var(--brand-700)", bgColor: "var(--brand-100)", borderColor: "var(--brand-400)", iconBg: "var(--brand-200)" },
  { type: "gift_card", label: "Gift Card", icon: CreditCard, color: "var(--blue-700)", bgColor: "var(--blue-100)", borderColor: "var(--blue-300)", iconBg: "#CCE8FF" },
  { type: "discount", label: "Discount Code", icon: Tag, color: "var(--green-700)", bgColor: "var(--green-100)", borderColor: "var(--green-300)", iconBg: "#C6F0E2" },
  { type: "paid", label: "Paid Fee", icon: DollarSign, color: "var(--orange-700)", bgColor: "var(--orange-100)", borderColor: "var(--orange-300)", iconBg: "var(--orange-300)" },
  { type: "commission_boost", label: "Commission Boost", icon: TrendingUp, color: "#7B61C2", bgColor: "#F3EEFF", borderColor: "#C9B8F0", iconBg: "#DDD0F7" },
];

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
// STEP 2 — Compensation & Creator Preferences
// ═══════════════════════════════════════════════════
interface CompensationDraft {
  compensationTypes: CompensationConfig[];
  creatorDescription: string;
}

function StepCompensation({
  draft,
  setDraft,
}: {
  draft: CompensationDraft;
  setDraft: React.Dispatch<React.SetStateAction<CompensationDraft>>;
}) {
  const toggleCompensation = (type: CompensationType, enabled: boolean) => {
    setDraft((prev) => ({
      ...prev,
      compensationTypes: prev.compensationTypes.map((c) =>
        c.type === type ? { ...c, enabled } : c
      ),
    }));
  };

  const updateCompensation = (type: CompensationType, field: string, value: unknown) => {
    setDraft((prev) => ({
      ...prev,
      compensationTypes: prev.compensationTypes.map((c) =>
        c.type === type ? { ...c, [field]: value } : c
      ),
    }));
  };

  const activeComps = draft.compensationTypes.filter((c) => c.enabled);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* ── Compensation Structure ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">Compensation Structure</h3>
          <p className="mt-0.5 text-xs text-[var(--neutral-400)]">
            What will you offer creators? Select all that apply.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {COMPENSATION_TILES.map((tile) => {
            const comp = draft.compensationTypes.find((c) => c.type === tile.type);
            const active = comp?.enabled ?? false;
            const isGated = GATED_COMPENSATION_TYPES.includes(tile.type);
            return (
              <div key={tile.type} className="relative">
                <button
                  type="button"
                  onClick={() => !isGated && toggleCompensation(tile.type, !active)}
                  disabled={isGated}
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${isGated ? "opacity-60" : ""}`}
                  style={{
                    backgroundColor: active && !isGated ? tile.bgColor : "white",
                    border: `2px solid ${active && !isGated ? tile.borderColor : "var(--neutral-200)"}`,
                    pointerEvents: isGated ? "none" : "auto",
                  }}
                >
                  {active && !isGated && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: tile.color }}>
                      <Check className="size-3 text-white" />
                    </div>
                  )}
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: tile.iconBg }}
                  >
                    <tile.icon className="size-4" style={{ color: tile.color }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: active && !isGated ? tile.color : "var(--neutral-700)" }}>
                    {tile.label}
                  </span>
                </button>
                {isGated && (
                  <div className="absolute inset-0 rounded-xl bg-black/5 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 shadow-sm border border-[var(--neutral-200)]">
                      <Lock className="size-3.5 text-[var(--neutral-600)]" />
                      <span className="text-xs font-semibold text-[var(--neutral-700)]">Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MVP info */}
        <div className="rounded-lg border border-[var(--yellow-300)] bg-[var(--yellow-50)] p-4">
          <div className="flex items-start gap-3">
            <Zap className="size-4 text-[var(--yellow-700)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--neutral-700)]">
              <span className="font-semibold">MVP:</span> Gift card & product via code. Paid, discount, and commission boost coming soon.
            </p>
          </div>
        </div>

        {/* Expanded detail inputs for active compensation types */}
        {activeComps.length > 0 && (
          <div className="space-y-4">
            {activeComps.map((comp) => {
              const tile = COMPENSATION_TILES.find((p) => p.type === comp.type)!;
              return (
                <div
                  key={comp.type}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: tile.bgColor, border: `1px solid ${tile.borderColor}` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <tile.icon className="size-4" style={{ color: tile.color }} />
                    <span className="text-sm font-semibold" style={{ color: tile.color }}>{tile.label}</span>
                  </div>

                  {comp.type === "gifted" && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Product name</Label>
                        <Input placeholder="e.g., Melted Balm" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.productName || ""} onChange={(e) => updateCompensation(comp.type, "productName", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Product URL</Label>
                        <Input placeholder="https://..." className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.productUrl || ""} onChange={(e) => updateCompensation(comp.type, "productUrl", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Est. value/unit</Label>
                        <Input type="number" placeholder="$35" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.estValuePerUnit || ""} onChange={(e) => updateCompensation(comp.type, "estValuePerUnit", Number(e.target.value))} />
                      </div>
                    </div>
                  )}

                  {comp.type === "gift_card" && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Gift card value</Label>
                        <Input type="number" placeholder="$50" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.giftCardValue || ""} onChange={(e) => updateCompensation(comp.type, "giftCardValue", Number(e.target.value))} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Product / Brand</Label>
                        <Input placeholder="e.g., Ulta Beauty" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.giftCardBrand || ""} onChange={(e) => updateCompensation(comp.type, "giftCardBrand", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Delivery</Label>
                        <Select value={comp.giftCardDelivery || "brand_provides"} onValueChange={(v) => updateCompensation(comp.type, "giftCardDelivery", v)}>
                          <SelectTrigger className="h-8 text-sm bg-white border-[var(--neutral-200)]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="brand_provides">Brand provides code</SelectItem>
                            <SelectItem value="benable_sends">Benable sends eGift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {comp.type === "discount" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Discount code</Label>
                        <Input placeholder="e.g., SUMMER20" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.discountCode || ""} onChange={(e) => updateCompensation(comp.type, "discountCode", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Discount amount</Label>
                        <Input placeholder="20% or $10" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.discountAmount || ""} onChange={(e) => updateCompensation(comp.type, "discountAmount", Number(e.target.value))} />
                      </div>
                    </div>
                  )}

                  {comp.type === "paid" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Min fee/creator</Label>
                        <Input type="number" placeholder="$100" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.feeMin || ""} onChange={(e) => updateCompensation(comp.type, "feeMin", Number(e.target.value))} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Max fee/creator</Label>
                        <Input type="number" placeholder="$300" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.feeMax || ""} onChange={(e) => updateCompensation(comp.type, "feeMax", Number(e.target.value))} />
                      </div>
                    </div>
                  )}

                  {comp.type === "commission_boost" && (
                    <div className="w-48">
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--neutral-600)]">Boosted commission rate</Label>
                        <Input type="number" placeholder="15%" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.commissionRate || ""} onChange={(e) => updateCompensation(comp.type, "commissionRate", Number(e.target.value))} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
    compensationTypes: [...defaultCompensationTypes],
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
    // In real app, would save to store & navigate to campaign detail
    navigate("/campaigns");
  };

  const canAdvance = step === 1
    ? briefDraft.brandDescription.trim().length > 0 && briefDraft.campaignDescription.trim().length > 0
    : compDraft.compensationTypes.some((c) => c.enabled);

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

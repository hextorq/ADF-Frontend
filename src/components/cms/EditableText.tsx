import { useState, type ElementType } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  contentKey: string;
  fallback: string;
  as?: ElementType;
  multiline?: boolean;
  className?: string;
  maxLength?: number;
  label?: string;
}

export function EditableText({
  contentKey,
  fallback,
  as: Tag = "span",
  multiline = false,
  className,
  maxLength,
  label,
}: EditableTextProps) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const value = useContentStore((s) => s.getContent(contentKey, fallback));
  const saveContent = useContentStore((s) => s.saveContent);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const effectiveMaxLength = maxLength ?? (multiline ? 2000 : 300);

  if (!isAdmin) {
    return <Tag className={className}>{value}</Tag>;
  }

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      toast.error("Text cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await saveContent(contentKey, trimmed);
      setOpen(false);
    } catch {
      toast.error("Failed to save — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <span className="group/editable relative inline-block">
      <Tag className={className}>{value}</Tag>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label ? `Edit ${label}` : "Edit text"}
            className="absolute -right-6 top-0 hidden h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white opacity-0 transition-opacity group-hover/editable:opacity-100 group-focus-within/editable:opacity-100 lg:inline-flex"
          >
            <Pencil className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="flex flex-col gap-2">
            {label && (
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </div>
            )}
            {multiline ? (
              <Textarea
                autoFocus
                value={draft}
                maxLength={effectiveMaxLength}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
              />
            ) : (
              <Input
                autoFocus
                value={draft}
                maxLength={effectiveMaxLength}
                onChange={(e) => setDraft(e.target.value)}
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {draft.length}/{effectiveMaxLength}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
}

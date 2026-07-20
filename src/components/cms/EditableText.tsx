import { useState, type ElementType, type ImgHTMLAttributes } from "react";
import { ImageIcon, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/api";

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
      toast.success("Text updated");
    } catch {
      toast.error("Failed to save — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tag className={cn("group/editable relative", className)}>
      {value}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label ? `Edit ${label}` : "Edit text"}
            className="absolute -top-3 -right-3 hidden h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-white opacity-0 shadow-md transition-opacity group-hover/editable:opacity-100 group-focus-within/editable:opacity-100 lg:inline-flex z-10"
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
    </Tag>
  );
}

interface EditableImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  contentKey: string;
  fallbackSrc: string;
  label?: string;
}

export function EditableImage({
  contentKey,
  fallbackSrc,
  label,
  className,
  alt = "",
  ...props
}: EditableImageProps) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const src = useContentStore((s) => s.getContent(contentKey, fallbackSrc));
  const saveContent = useContentStore((s) => s.saveContent);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(src);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!isAdmin) {
    return <img src={src} alt={alt} className={className} {...props} />;
  }

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(src);
    setOpen(next);
  };

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      toast.error("Image URL cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await saveContent(contentKey, trimmed);
      setOpen(false);
      toast.success("Image updated");
    } catch {
      toast.error("Failed to save image - please try again");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setDraft(url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <span className="group/editable-image relative inline-block">
      <img src={src} alt={alt} className={className} {...props} />
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label ? `Edit ${label}` : "Edit image"}
            className="absolute right-1 top-1 hidden h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-white opacity-0 shadow-md transition-opacity group-hover/editable-image:opacity-100 group-focus-within/editable-image:opacity-100 lg:inline-flex"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="start">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label ?? "Image URL"}
              </div>
              <Input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="/logo.png or https://..."
                className="mt-2"
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Upload image
              </div>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="mt-2"
              />
            </div>
            <div className="overflow-hidden rounded-md border bg-muted">
              <img src={draft || fallbackSrc} alt="" className="max-h-40 w-full object-contain" />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSave} disabled={saving || uploading}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
}

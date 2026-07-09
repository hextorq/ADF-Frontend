import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitBoardApplication } from "@/actions";
import { EditableText } from "@/components/cms/EditableText";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  affiliation: z.string().min(2, "Please enter your institution/affiliation."),
  profileLink: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
  message: z.string().optional(),
});

type BoardApplicationFormProps = {
  boardType: "Editorial Board" | "Reviewer Network";
  buttonText: string;
};

export function BoardApplicationForm({ boardType, buttonText }: BoardApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      affiliation: "",
      profileLink: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await submitBoardApplication({ data: { ...values, boardType } });
      setIsSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => setIsSuccess(false), 300);
        form.reset();
      }, 2500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary font-semibold py-3 px-6 text-lg">
          <EditableText contentKey={`boardApplication.${boardType}.button`} fallback={buttonText} as="span" label="Application button" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <EditableText contentKey={`boardApplication.${boardType}.title`} fallback={`Join the ${boardType}`} as="span" label="Dialog title" />
          </DialogTitle>
          <DialogDescription>
            {isSuccess ? (
              <EditableText contentKey={`boardApplication.${boardType}.success`} fallback="Thank you! Your application has been received. We will be in touch shortly." as="span" label="Success message" />
            ) : (
              <EditableText contentKey={`boardApplication.${boardType}.description`} fallback="Fill out the form below to apply. Your information will be sent to the editorial office." as="span" label="Dialog description" />
            )}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><EditableText contentKey="boardApplication.form.fullName" fallback="Full Name *" as="span" label="Form label" /></FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><EditableText contentKey="boardApplication.form.email" fallback="Email Address *" as="span" label="Form label" /></FormLabel>
                    <FormControl>
                      <Input placeholder="jane.doe@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><EditableText contentKey="boardApplication.form.affiliation" fallback="Institutional Affiliation *" as="span" label="Form label" /></FormLabel>
                    <FormControl>
                      <Input placeholder="University of..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profileLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><EditableText contentKey="boardApplication.form.profile" fallback="Academic Profile or CV Link" as="span" label="Form label" /></FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><EditableText contentKey="boardApplication.form.comments" fallback="Additional Comments (Optional)" as="span" label="Form label" /></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any specific areas of expertise..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? (
                    <EditableText contentKey="boardApplication.form.submitting" fallback="Submitting..." as="span" label="Submitting label" />
                  ) : (
                    <EditableText contentKey="boardApplication.form.submit" fallback="Submit Application" as="span" label="Submit label" />
                  )}
                </button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}


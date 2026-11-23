"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
const TOPICS = ["General enquiry", "Order support", "Returns & exchanges", "Wholesale", "Feedback"];
export function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState(TOPICS[0]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please complete the required fields.");
            return;
        }
        setSending(true);
        await new Promise((resolve) => setTimeout(resolve, 650));
        toast.success("Message sent — we'll be in touch within 24 hours.");
        setName("");
        setEmail("");
        setSubject(TOPICS[0]);
        setMessage("");
        setSending(false);
    };
    return (<form onSubmit={handleSubmit} className="surface p-6 sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600">Write to us</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-ink-900">Send a message</h2>
      <p className="mt-1.5 text-sm text-ink-500">
        Have a question about fit, fabric or an order? Our team is happy to help.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ayesha Rahman" autoComplete="name"/>
        </Field>
        <Field label="Email address" required>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email"/>
        </Field>
        <Field label="Topic" className="sm:col-span-2">
          <Select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {TOPICS.map((topic) => (<option key={topic} value={topic}>
                {topic}
              </option>))}
          </Select>
        </Field>
        <Field label="Message" required className="sm:col-span-2">
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us how we can help…" rows={6}/>
        </Field>
      </div>

      <Button type="submit" size="lg" loading={sending} className="mt-6 w-full sm:w-auto">
        {!sending && <Send className="size-4"/>}
        Send message
      </Button>
      <p className="mt-3 text-xs text-ink-400">
        We typically reply within one business day. For urgent order help, call us directly.
      </p>
    </form>);
}

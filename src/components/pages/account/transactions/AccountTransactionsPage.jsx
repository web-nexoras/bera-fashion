"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CheckCircle2, Clock3, CreditCard, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/section-heading";
import { getTransactions } from "@/api/account.js";
import { formatBDT, formatDate, titleCase } from "@/lib/utils";
export default function TransactionsPage() {
    const transactionsQuery = useQuery({
        queryKey: ["account", "transactions"],
        queryFn: () => getTransactions().then((result) => result.data ?? []),
    });
    const transactions = transactionsQuery.data ?? [];
    const paid = transactions.filter((item) => item.status === "paid");
    const pending = transactions.filter((item) => item.status === "pending");
    const refunded = transactions.filter((item) => item.status === "refunded" || item.status === "failed");
    const summary = [
        { label: "Total paid", value: formatBDT(paid.reduce((sum, item) => sum + item.amount, 0)), icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
        { label: "Successful payments", value: String(paid.length), icon: CreditCard, tone: "bg-brand-50 text-brand-700" },
        { label: "Pending", value: String(pending.length), icon: Clock3, tone: "bg-amber-50 text-amber-600" },
        { label: "Refunded / failed", value: String(refunded.length), icon: RotateCcw, tone: "bg-ink-100 text-ink-600" },
    ];
    return (<div className="animate-fade-up">
      <PageHeading title="Payment history" description="A clear record of every payment you've made."/>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(({ label, value, icon: Icon, tone }) => (<Card key={label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-ink-500">{label}</p>
                {transactionsQuery.isLoading ? (<Skeleton className="mt-3 h-7 w-20"/>) : (<p className="mt-2 font-display text-2xl font-bold text-ink-900">{value}</p>)}
              </div>
              <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-[18px]" strokeWidth={1.8}/>
              </span>
            </div>
          </Card>))}
      </div>

      <Card className="overflow-hidden">
        {transactionsQuery.isLoading ? (<div className="space-y-3 p-5">
            <Skeleton className="h-12 w-full"/>
            <Skeleton className="h-12 w-full"/>
            <Skeleton className="h-12 w-full"/>
          </div>) : (<DataTable columns={[
                { key: "reference", label: "Transaction" },
                { key: "order", label: "Order" },
                { key: "method", label: "Method" },
                { key: "amount", label: "Amount", align: "right" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
            ]} rows={transactions.map((transaction) => ({
                reference: (<div>
                  <p className="font-bold text-ink-800">{transaction.transactionId}</p>
                  <p className="text-[11px] text-ink-400">{transaction._id}</p>
                </div>),
                order: transaction.orderNumber ? (<Link href={`/account/orders/${transaction.orderId}`} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
                  {transaction.orderNumber} <ArrowUpRight className="size-3"/>
                </Link>) : ("—"),
                method: (<Badge tone={transaction.method === "cod" ? "neutral" : "brand"}>
                  {transaction.method === "cod" ? "Cash on delivery" : "SSLCommerz"}
                </Badge>),
                amount: <span className="font-bold text-ink-900">{formatBDT(transaction.amount)}</span>,
                status: <Badge status={transaction.status} dot>{titleCase(transaction.status)}</Badge>,
                date: <span className="text-ink-500">{formatDate(transaction.createdAt)}</span>,
            }))} empty="No transactions yet."/>)}
      </Card>
    </div>);
}

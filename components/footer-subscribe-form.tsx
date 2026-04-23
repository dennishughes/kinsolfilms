"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { subscribeAction } from "@/app/actions/subscribe"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function FooterSubscribeForm() {
    const [state, formAction, isPending] = useActionState(subscribeAction, null)

    return (
        <div className="w-full max-w-sm">
            <form action={formAction} className="flex items-center w-full relative">
                <Input
                    type="email"
                    name="email"
                    required
                    placeholder="enter your email"
                    disabled={isPending || state?.success}
                    className="bg-white text-slate-800 border-0 px-4 py-2 rounded-r-none h-10 w-full disabled:opacity-50"
                />
                <Button
                    type="submit"
                    disabled={isPending || state?.success}
                    className="bg-slate-600 hover:bg-slate-700 px-6 h-10 rounded-l-none whitespace-nowrap disabled:opacity-50"
                >
                    {isPending ? "subscribing..." : "subscribe"}
                </Button>
            </form>

            {state && (
                <div className={`mt-2 flex items-center text-sm ${state.success ? 'text-green-400' : 'text-red-400'}`}>
                    {state.success ? (
                        <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    )}
                    <span>{state.message}</span>
                </div>
            )}
        </div>
    )
}

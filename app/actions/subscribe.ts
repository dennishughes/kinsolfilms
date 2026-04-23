"use server"

import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)
const contactEmail = process.env.CONTACT_EMAIL || "info@empressave.com"

const subscribeSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

export async function subscribeAction(
    prevState: { success: boolean; message: string } | null,
    formData: FormData
) {
    const result = subscribeSchema.safeParse({
        email: formData.get("email"),
    })

    if (!result.success) {
        return {
            success: false,
            message: "Please enter a valid email address.",
        }
    }

    const { email } = result.data

    if (!process.env.RESEND_API_KEY) {
        return {
            success: false,
            message: "Resend API key missing. Please configure .env.local",
        }
    }

    try {
        const data = await resend.emails.send({
            from: "Empress Avenue Media Website <onboarding@resend.dev>", // Note: requires verification of domain or sending to verified email
            to: contactEmail,
            subject: "New Newsletter Subscriber!",
            text: `You have a new subscriber from the website footer form.\n\nEmail: ${email}\n\nPlease add them to your mailing list.`,
        })

        if (data.error) {
            console.error("Resend API error:", data.error)
            return {
                success: false,
                message: "Failed to send subscription. Please try again.",
            }
        }

        return {
            success: true,
            message: "Thanks for subscribing!",
        }
    } catch (error) {
        console.error("Server error during subscription:", error)
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        }
    }
}

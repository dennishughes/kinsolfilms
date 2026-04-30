"use server"

import { z } from "zod"

const PHP_ENDPOINT = "https://kinsolfilms.empressave.com/subscribe.php"

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

    try {
        const response = await fetch(PHP_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        return {
            success: data.success === true,
            message: data.message || (data.success ? "Thanks for subscribing!" : "Failed to subscribe. Please try again."),
        }
    } catch (error) {
        console.error("Error during subscription fetch:", error)
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        }
    }
}

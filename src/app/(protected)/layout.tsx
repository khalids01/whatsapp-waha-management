
import { endpoints } from "@/constants/endpoints"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect(endpoints.pages.signin)
    }
    return <>{children}</>
}

export default ProtectedLayout;
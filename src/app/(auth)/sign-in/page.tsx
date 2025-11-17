import { ThemeToggle } from "@/components/theme-toggle"
import { SignInForm } from "@/features/auth/magic-link-auth"
import Link from "next/link"

const Page = () => {
  return <>
    <header className="sticky top-0 z-10 border-b bg-background/60 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block size-6 rounded bg-primary/20" />
          <span className="font-semibold">WAHA Manager</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
    <div className="pt-16">
      <SignInForm />
    </div>
  </>
}

export default Page
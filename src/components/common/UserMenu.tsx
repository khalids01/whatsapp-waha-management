"use client"

import Link from "next/link"
import { LogOut, LayoutDashboard } from "lucide-react"

import { signOut, useSession } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export const UserMenu = () => {
  const { data, } = useSession()
  const router = useRouter()
  const displayName = data?.user?.name ?? data?.user?.email ?? "Account"
  const email = data?.user?.email ?? "Signed out"
  const initials = (data?.user?.name ?? data?.user?.email ?? "?")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")

  const handleLogout = () => {
     signOut().then(() => {
        router.push("/")
     })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="border-input hover:bg-accent focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background transition"
          onClick={handleLogout}
        >
          <Avatar className="size-8">
            {data?.user?.image ? (
              <AvatarImage src={data.user.image} alt={displayName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium">{displayName}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex w-full items-center gap-2">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => {
            void signOut()
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
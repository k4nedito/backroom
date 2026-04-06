"use client";

import { useRouter } from "next/navigation";
import { User as UserIcon, SignOut, Gear, UserCircle } from "@phosphor-icons/react";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@workspace/ui/components/dropdown-menu";
import { api } from "@/lib/api";

type Props = {
  name: string;
  email: string;
  role: "seeker" | "builder";
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileMenu({ name, email, role }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await api("/seeker/auth/logout", { method: "POST", body: JSON.stringify({}) });
    router.push("/auth");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-sm px-2 py-1 hover:bg-muted/50 transition-colors outline-none"
        >
          <Avatar size="sm">
            <AvatarFallback className="text-[10px] font-medium bg-foreground/10 text-foreground">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] tracking-wide text-foreground/80">
            {name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2.5">
          <span className="text-[11px] font-medium text-foreground">{name}</span>
          <span className="text-[10px] text-muted-foreground/60 font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            router.push(role === "seeker" ? "/seeker/settings" : "/builder/profile")
          }
        >
          <UserCircle className="size-3.5" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            router.push(role === "seeker" ? "/seeker/settings" : "/builder/settings")
          }
        >
          <Gear className="size-3.5" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <SignOut className="size-3.5" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

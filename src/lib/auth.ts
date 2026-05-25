import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureStoreUser, type ClerkProfile } from "./users";
import type { StoreUser } from "@/types";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Unauthorized" };
  }
  return { ok: true as const, userId };
}

export async function getAuthenticatedStoreUser(): Promise<
  | { ok: true; storeUser: StoreUser; clerkId: string }
  | { ok: false; error: string; status: number }
> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "Sign in required.", status: 401 };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { ok: false, error: "Sign in required.", status: 401 };
  }

  const email = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  if (!email) {
    return { ok: false, error: "A verified email is required.", status: 400 };
  }

  const profile: ClerkProfile = {
    clerkId: userId,
    email,
    fullName:
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      null,
    imageUrl: clerkUser.imageUrl,
  };

  const storeUser = await ensureStoreUser(profile);
  return { ok: true, storeUser, clerkId: userId };
}

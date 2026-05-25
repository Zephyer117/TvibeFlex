import { sanityWriteClient } from "./sanity";
import type { StoreUser } from "@/types";

export interface ClerkProfile {
  clerkId: string;
  email: string;
  fullName?: string | null;
  imageUrl?: string | null;
}

export async function getStoreUserByClerkId(
  clerkId: string
): Promise<StoreUser | null> {
  return sanityWriteClient.fetch(
    `*[_type == "storeUser" && clerkId == $clerkId][0]`,
    { clerkId },
    { cache: "no-store" }
  );
}

/** Create or update Sanity customer linked to Clerk account */
export async function ensureStoreUser(
  profile: ClerkProfile
): Promise<StoreUser> {
  const existing = await getStoreUserByClerkId(profile.clerkId);

  if (existing?._id) {
    await sanityWriteClient
      .patch(existing._id)
      .set({
        email: profile.email,
        fullName: profile.fullName || existing.fullName || "",
        imageUrl: profile.imageUrl || existing.imageUrl || "",
      })
      .commit();
    return {
      ...existing,
      email: profile.email,
      fullName: profile.fullName || existing.fullName,
      imageUrl: profile.imageUrl || existing.imageUrl,
    };
  }

  const created = await sanityWriteClient.create({
    _type: "storeUser",
    clerkId: profile.clerkId,
    email: profile.email,
    fullName: profile.fullName || "",
    imageUrl: profile.imageUrl || "",
  });

  return created as unknown as StoreUser;
}

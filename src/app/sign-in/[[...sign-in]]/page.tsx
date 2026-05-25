import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6 py-20">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "card-luxury shadow-none border border-[var(--border)]",
          },
        }}
        signUpUrl="/sign-up"
        forceRedirectUrl="/account/orders"
      />
    </div>
  );
}

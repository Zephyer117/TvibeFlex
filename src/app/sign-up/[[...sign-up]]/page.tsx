import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6 py-20">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "card-luxury shadow-none border border-[var(--border)]",
          },
        }}
        signInUrl="/sign-in"
        forceRedirectUrl="/account/orders"
      />
    </div>
  );
}

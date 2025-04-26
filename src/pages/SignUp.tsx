
import { SignUpHeader } from "@/components/signup/SignUpHeader";
import { SignUpForm } from "@/components/signup/SignUpForm";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SignUpHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up to start growing your law practice
            </p>
          </div>
          <SignUpForm />
        </div>
      </main>
    </div>
  );
};

export default SignUp;

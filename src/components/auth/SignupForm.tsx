
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { register, handleSubmit, formState: { errors }, setError, setValue, watch } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "user",
      department: "security",
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...signupData } = data;

      // Call signup API
      await authService.signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        department: data.department,
        phoneNumber: data.phoneNumber,
        role: data.role || "user",
      });

      toast({
        title: "Account created",
        description: "Your account has been created successfully. You can now log in.",
        variant: "default",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Signup error:", error);
      
      // Handle known error types
      if (error instanceof Error) {
        if (error.message.includes("Email already exists")) {
          setError("email", {
            type: "manual",
            message: "This email is already registered"
          });
        } else {
          toast({
            title: "Registration failed",
            description: error.message || "There was a problem creating your account",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Registration failed",
          description: "There was a problem creating your account",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto py-4 px-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="firstName"
            {...register("firstName")}
            autoComplete="given-name"
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            {...register("lastName")}
            autoComplete="family-name"
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          autoComplete="email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium">
            Department
          </label>
          <Select 
            defaultValue="security"
            onValueChange={(value) => setValue("department", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number (optional)
          </label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            autoComplete="tel"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Create Account
          </>
        )}
      </Button>
    </form>
  );
}

// Export the component as default and named export
export default SignupForm;

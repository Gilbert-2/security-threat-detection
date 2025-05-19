import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Landing = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    navigate('/');
  };

  const handleSignupSuccess = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-security-blue/20 text-security-blue">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-security-blue to-accent bg-clip-text text-transparent">Security Threat Monitor</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Real-time security monitoring & response</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setLoginOpen(true)}>
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Button>
          <Button onClick={() => setSignupOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Sign up
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 bg-gradient-to-b from-slate-900 to-slate-950">
        <Card className="max-w-4xl w-full bg-slate-800/80 border-slate-700/50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-security-blue to-accent bg-clip-text text-transparent">
              Advanced Security Monitoring Platform
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-slate-300">
              Real-time threat detection and intelligent response system
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-slate-300">
            <p>Our comprehensive security platform provides state-of-the-art monitoring 
            capabilities, intelligent threat detection, and automated response protocols.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50">
                <h3 className="font-bold text-lg text-security-blue mb-2">Real-time Monitoring</h3>
                <p className="text-sm">Continuous surveillance with advanced camera integration and video analytics</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50">
                <h3 className="font-bold text-lg text-security-blue mb-2">Threat Detection</h3>
                <p className="text-sm">AI-powered algorithms identify potential security threats with high accuracy</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50">
                <h3 className="font-bold text-lg text-security-blue mb-2">Automated Response</h3>
                <p className="text-sm">Configurable response protocols to handle security incidents efficiently</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => setSignupOpen(true)}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLoginOpen(true)}>
              Access Dashboard
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-security-blue">Log In</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the dashboard
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="sm:max-w-[450px] md:max-w-[500px] bg-slate-800 border-slate-700 max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-security-blue">Create Account</DialogTitle>
            <DialogDescription>
              Sign up to start using the security monitoring platform
            </DialogDescription>
          </DialogHeader>
          <SignupForm onSuccess={handleSignupSuccess} />
        </DialogContent>
      </Dialog>

      <footer className="py-4 px-6 bg-slate-900/90 border-t border-slate-800 text-center text-sm text-slate-500">
        © 2025 Security Threat Monitor. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

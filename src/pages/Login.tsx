import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (role: 'admin' | 'operator') => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulated login - accept any credentials
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    // Simulate role based on email domain
    const role = email.includes('admin') ? 'admin' : 'operator';
    
    toast.success(`Logged in as ${role}`);
    onLogin(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">L&T Rubber Processing Machinery</h1>
            <p className="text-sm text-muted-foreground text-mono">Security Monitoring Platform</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@highonswift.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              size="lg"
            >
              Login to System
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-secondary/50 border border-border rounded-md">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-mono">
              <p className="text-foreground">Admin: admin@highonswift.com</p>
              <p className="text-foreground">Operator: operator@highonswift.com</p>
              <p className="text-muted-foreground">Password: any</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Simulated login for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

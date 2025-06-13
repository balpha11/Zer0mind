import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

import { adminLogin } from '@/services/api';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { access_token } = await adminLogin(email, password);

      // ✅ Save token + auth flag
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('isAdminAuthenticated', 'true');

      toast({
        title: 'Admin Login Successful!',
        description: 'Redirecting to Admin Panel…',
      });

      setTimeout(() => navigate('/admin'), 800);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: err.message || 'Invalid admin credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      <motion.div
        className="w-full max-w-md bg-card p-8 rounded-xl shadow-2xl border border-border/50"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-2">
            <Shield className="h-12 w-12 text-primary" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Super Admin Panel</h1>
          <p className="text-muted-foreground">Secure login for administrators.</p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3"
          >
            {loading ? 'Signing in…' : 'Login to Admin Panel'}
          </Button>
        </form>

        {/* ── Footer ── */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">
            &larr; Back to main site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

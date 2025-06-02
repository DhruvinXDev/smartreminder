
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  
  const { signIn, signUp, resendConfirmation, handleEmailConfirmation, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Handle email confirmation when component mounts
    const checkConfirmation = async () => {
      const result = await handleEmailConfirmation();
      
      if (result.error) {
        toast({
          title: "Confirmation Failed",
          description: result.error.message,
          variant: "destructive",
        });
        
        // Show resend option for expired links
        if (result.error.message.includes('expired')) {
          setShowResendConfirmation(true);
        }
      } else if (result.success) {
        setConfirmationSuccess(true);
        toast({
          title: "Email Confirmed!",
          description: "Your email has been confirmed successfully. You can now sign in.",
        });
        setIsLogin(true);
      }
    };

    checkConfirmation();
  }, [handleEmailConfirmation, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResendConfirmation(false);

    try {
      if (isLogin) {
        console.log('Attempting login for:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.log('Login error:', error);
          
          // Show resend confirmation option if email not confirmed
          if (error.message.includes('confirmation link') || error.message.includes('Email not confirmed')) {
            setShowResendConfirmation(true);
            setConfirmationEmail(email);
          }
          
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate('/');
        }
      } else {
        console.log('Attempting signup for:', email);
        const { error, needsConfirmation } = await signUp(email, password, firstName, lastName);
        if (error) {
          console.log('Signup error:', error);
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        } else if (needsConfirmation) {
          toast({
            title: "Check Your Email",
            description: "Please check your email and click the confirmation link to complete your registration.",
          });
          setShowResendConfirmation(true);
          setConfirmationEmail(email);
          setIsLogin(true);
          setPassword('');
        } else {
          toast({
            title: "Account Created",
            description: "Your account has been created successfully!",
          });
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!confirmationEmail) return;
    
    setLoading(true);
    try {
      const { error } = await resendConfirmation(confirmationEmail);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Sent",
          description: "A new confirmation email has been sent. Please check your inbox.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
            SR
          </div>
          <CardTitle className="text-2xl font-bold">
            {confirmationSuccess ? 'Email Confirmed!' : (isLogin ? 'Welcome back' : 'Create account')}
          </CardTitle>
          <CardDescription>
            {confirmationSuccess 
              ? 'Your email has been confirmed. You can now sign in to your account.'
              : (isLogin 
                ? 'Sign in to your SmartReminder account' 
                : 'Get started with SmartReminder today'
              )
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          {showResendConfirmation && confirmationEmail && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                Haven't received the confirmation email or the link expired?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendConfirmation}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Resend Confirmation Email'}
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setShowResendConfirmation(false);
                setConfirmationSuccess(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

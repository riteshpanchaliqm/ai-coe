import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { user, signInWithGoogle, error } = useAuthStore();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="h-9 w-9" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="2.5" fill="white" opacity="0.9"/>
                <circle cx="21" cy="11" r="2.5" fill="white" opacity="0.9"/>
                <circle cx="16" cy="18" r="3" fill="white"/>
                <circle cx="10" cy="24" r="2" fill="white" opacity="0.8"/>
                <circle cx="22" cy="24" r="2" fill="white" opacity="0.8"/>
                <line x1="11" y1="13.5" x2="16" y2="15" stroke="white" strokeWidth="1.2" opacity="0.6"/>
                <line x1="21" y1="13.5" x2="16" y2="15" stroke="white" strokeWidth="1.2" opacity="0.6"/>
                <line x1="16" y1="21" x2="10" y2="24" stroke="white" strokeWidth="1.2" opacity="0.6"/>
                <line x1="16" y1="21" x2="22" y2="24" stroke="white" strokeWidth="1.2" opacity="0.6"/>
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl">AI CoE Portal</CardTitle>
          <CardDescription>
            Submit and track AI project proposals for committee review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button className="w-full" onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Only @iqm.com emails are allowed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

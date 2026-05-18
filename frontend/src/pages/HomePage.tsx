import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PlusCircle, List, FileText } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          The AI Center of Excellence Portal is your single place to submit AI proposals,
          get structured committee feedback, and track outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/submit')}>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Submit a Proposal</CardTitle>
            <CardDescription>Have an AI idea? Submit it for committee review.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm">New Proposal</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/proposals')}>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <List className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">View Proposals</CardTitle>
            <CardDescription>Browse all submitted proposals and their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Browse</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/my-proposals')}>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">My Proposals</CardTitle>
            <CardDescription>Track the status of your own submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">My Proposals</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

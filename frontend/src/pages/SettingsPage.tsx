import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useAuthStore } from '../store/authStore';

export function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div>
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
          <div>
            <Label>Roles</Label>
            <p className="text-sm text-muted-foreground">{user?.roles.join(', ')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

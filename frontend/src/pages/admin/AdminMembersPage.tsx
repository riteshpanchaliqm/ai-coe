import { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { api } from '../../lib/api';

interface Member {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await api.get<{ members: Member[] }>('/admin/members');
      setMembers(res.members);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const assignRole = async (userId: string, role: string) => {
    try {
      await api.post('/admin/members/roles', { user_id: userId, role });
      fetchMembers();
    } catch (err) { console.error(err); }
  };

  const removeRole = async (userId: string, role: string) => {
    try {
      await api.delete('/admin/members/roles', { user_id: userId, role });
      fetchMembers();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Member Management</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="pt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <div className="flex gap-1 mt-2">
                    {member.roles.map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeRole(member.id, role)}
                      >
                        {role} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  {['reviewer', 'chair', 'admin'].filter((r) => !member.roles.includes(r)).map((role) => (
                    <Button key={role} variant="outline" size="sm" onClick={() => assignRole(member.id, role)}>
                      + {role}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

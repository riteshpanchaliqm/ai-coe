import { useState, useEffect, useMemo } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { api } from '../../lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, UserPlus, X } from 'lucide-react';

interface Member {
  id: string;
  email: string;
  name: string;
  roles: string[];
  created_at: string;
}

const ROLE_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
  submitter: 'secondary',
  reviewer: 'info',
  chair: 'warning',
  admin: 'destructive',
};

const ROLE_LABELS: Record<string, string> = {
  submitter: 'Submitter',
  reviewer: 'Reviewer',
  chair: 'Chair',
  admin: 'Admin',
};

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

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

  const filtered = useMemo(() => {
    let result = [...members];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name?.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'All') {
      result = result.filter((m) => m.roles.includes(roleFilter));
    }
    return result;
  }, [members, search, roleFilter]);

  const totalReviewers = members.filter((m) => m.roles.includes('reviewer')).length;
  const totalAdmins = members.filter((m) => m.roles.includes('admin')).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Member Management</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{members.length} members</span>
          <span>·</span>
          <span>{totalReviewers} reviewers</span>
          <span>·</span>
          <span>{totalAdmins} admins</span>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="submitter">Submitter</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="chair">Chair</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} of {members.length} members
            </span>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Roles</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {member.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium">{member.name || '—'}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{member.email}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {member.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={ROLE_COLORS[role] || 'secondary'}
                              className="cursor-pointer gap-1"
                              onClick={() => removeRole(member.id, role)}
                            >
                              {ROLE_LABELS[role] || role}
                              <X className="h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          {['reviewer', 'chair', 'admin']
                            .filter((r) => !member.roles.includes(r))
                            .map((role) => (
                              <Button
                                key={role}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 px-2"
                                onClick={() => assignRole(member.id, role)}
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                {ROLE_LABELS[role] || role}
                              </Button>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { User } from '@core/data/supabase/users/users.repository';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { getTranslations } from 'next-intl/server';

async function getUsers(): Promise<User[]> {
  const repository = SupabaseRepository();
  const users = await repository.users.getAll();
  return users;
}

export default async function UsersPage() {
  const t = await getTranslations();
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('SIDEBAR.USERS')}</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('PRODUCTS.NAME')}</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>{t('PRODUCTS.CREATED_AT')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  {t('COMMON.NO_RESULTS')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

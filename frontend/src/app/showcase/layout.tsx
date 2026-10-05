import { getCurrentUser } from '../../lib/auth';
import { ShowcaseAppShell } from '../../modules/showcase/components/showcase-app-shell';

export default async function ShowcaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return <ShowcaseAppShell user={user}>{children}</ShowcaseAppShell>;
}
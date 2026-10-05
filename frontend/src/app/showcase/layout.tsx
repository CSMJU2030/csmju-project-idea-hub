import { getCurrentUser } from '../../modules/showcase/auth/core-auth.adapter';
import { ShowcaseAppShell } from '../../modules/showcase/components/showcase-app-shell';

export default async function ShowcaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return <ShowcaseAppShell user={user}>{children}</ShowcaseAppShell>;
}
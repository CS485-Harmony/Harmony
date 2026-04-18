import { ServerSettingsPage } from '@/components/settings/ServerSettingsPage';
import { requireServerSettingsAccess } from './settings-access';

interface PageProps {
  params: Promise<{ serverSlug: string }>;
}

export default async function ServerSettingsRoute({ params }: PageProps) {
  const { serverSlug } = await params;
  const server = await requireServerSettingsAccess(serverSlug);

  return <ServerSettingsPage server={server} serverSlug={serverSlug} />;
}

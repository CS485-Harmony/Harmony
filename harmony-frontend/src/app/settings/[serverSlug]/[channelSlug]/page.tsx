import { notFound } from 'next/navigation';
import { getChannel } from '@/services/channelService';
import { ChannelSettingsPage } from '@/components/settings/ChannelSettingsPage';
import { requireServerSettingsAccess } from '@/app/settings/[serverSlug]/settings-access';

interface PageProps {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const { serverSlug, channelSlug } = await params;
  await requireServerSettingsAccess(serverSlug);

  const channel = await getChannel(serverSlug, channelSlug);
  if (!channel) notFound();

  return <ChannelSettingsPage channel={channel} serverSlug={serverSlug} canManageSeo />;
}

import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MembersSidebar } from '../components/channel/MembersSidebar';
import type { User } from '../types';

/* eslint-disable @next/next/no-img-element */
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={props.alt ?? ''} {...props} />
  ),
}));

const MEMBERS: User[] = [
  {
    id: '1',
    username: 'owner-online',
    displayName: 'Owner Online',
    role: 'owner',
    status: 'online',
  },
  {
    id: '5',
    username: 'admin-online',
    displayName: 'Admin Online',
    role: 'admin',
    status: 'online',
  },
  {
    id: '2',
    username: 'member-idle',
    displayName: 'Member Idle',
    role: 'member',
    status: 'idle',
  },
  {
    id: '3',
    username: 'admin-offline',
    displayName: 'Admin Offline',
    role: 'admin',
    status: 'offline',
  },
  {
    id: '4',
    username: 'guest-offline',
    displayName: 'Guest Offline',
    role: 'guest',
    status: 'offline',
  },
];

describe('MembersSidebar', () => {
  it('separates online and offline users into distinct sections', () => {
    render(<MembersSidebar members={MEMBERS} isOpen />);

    expect(screen.getByText('Online — 3')).toBeInTheDocument();
    expect(screen.getByText('Offline — 2')).toBeInTheDocument();
    expect(screen.getByText('Owners — 1')).toBeInTheDocument();
    expect(screen.getAllByText('Admins — 1')).toHaveLength(2);
    expect(screen.getByText('Members — 1')).toBeInTheDocument();
    expect(screen.getByText('Guests — 1')).toBeInTheDocument();
  });

  it('separates each presence section by role priority', () => {
    render(<MembersSidebar members={MEMBERS} isOpen />);

    const onlineHeading = screen.getByText('Online — 3');
    const offlineHeading = screen.getByText('Offline — 2');
    const onlineSection = onlineHeading.parentElement;
    const offlineSection = offlineHeading.parentElement;

    expect(onlineSection).not.toBeNull();
    expect(offlineSection).not.toBeNull();

    const onlineOwnersHeading = within(onlineSection as HTMLElement).getByText('Owners — 1');
    const onlineAdminsHeading = within(onlineSection as HTMLElement).getByText('Admins — 1');
    const onlineMembersHeading = within(onlineSection as HTMLElement).getByText('Members — 1');
    const offlineAdminsHeading = within(offlineSection as HTMLElement).getByText('Admins — 1');
    const offlineGuestsHeading = within(offlineSection as HTMLElement).getByText('Guests — 1');

    const onlineOwnersList = onlineOwnersHeading.nextElementSibling;
    const onlineAdminsList = onlineAdminsHeading.nextElementSibling;
    const onlineMembersList = onlineMembersHeading.nextElementSibling;
    const offlineAdminsList = offlineAdminsHeading.nextElementSibling;
    const offlineGuestsList = offlineGuestsHeading.nextElementSibling;

    expect(onlineOwnersList).not.toBeNull();
    expect(onlineAdminsList).not.toBeNull();
    expect(onlineMembersList).not.toBeNull();
    expect(offlineAdminsList).not.toBeNull();
    expect(offlineGuestsList).not.toBeNull();

    expect(within(onlineOwnersList as HTMLElement).getByRole('listitem')).toHaveTextContent(
      'Owner Online',
    );
    expect(within(onlineAdminsList as HTMLElement).getByRole('listitem')).toHaveTextContent(
      'Admin Online',
    );
    expect(within(onlineMembersList as HTMLElement).getByRole('listitem')).toHaveTextContent(
      'Member Idle',
    );
    expect(within(offlineAdminsList as HTMLElement).getByRole('listitem')).toHaveTextContent(
      'Admin Offline',
    );
    expect(within(offlineGuestsList as HTMLElement).getByRole('listitem')).toHaveTextContent(
      'Guest Offline',
    );
  });
});

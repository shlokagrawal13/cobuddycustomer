import type {Session} from '../types/models.types';
export const MOCK_SESSIONS: Session[] = [
  {id: 'ses_001', bookingId: 'bk_001', companionId: 'cmp_001',
   companionName: 'Sophia Laurent', companionAvatar: '',
   venueName: 'Nobu Restaurant', status: 'upcoming',
   startTime: new Date(Date.now() + 86400000).toISOString(),
   endTime: new Date(Date.now() + 86400000 + 7200000).toISOString(),
   arrivalVerified: false, totalAmount: 55000},
];

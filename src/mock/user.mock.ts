import type {UserProfile} from '../types/models.types';
export const MOCK_USER: UserProfile = {
  id: 'usr_001', name: 'Alex Harrington', phone: '+1 555 000 0001',
  email: 'alex@example.com', bio: 'Luxury lifestyle enthusiast.',
  trustScore: 94.5, membershipTier: 'black', verificationStatus: 'verified',
  interests: ['Fine Dining', 'Art', 'Travel', 'Wellness'],
  language: 'en', createdAt: '2024-01-15T00:00:00Z',
};

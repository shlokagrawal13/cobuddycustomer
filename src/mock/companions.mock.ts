import type {Companion} from '../types/models.types';
export const MOCK_COMPANIONS: Companion[] = [
  {id: 'cmp_001', name: 'Sophia Laurent', avatar: '', bio: 'Art curator & cultural guide.',
   trustScore: 98.2, verificationStatus: 'verified', rating: 4.97, reviewCount: 312,
   hourlyRate: 25000, specialties: ['Art', 'Dining', 'Culture'],
   languages: ['English', 'French'], isAvailable: true, memberSince: '2023-06-01T00:00:00Z'},
  {id: 'cmp_002', name: 'Marcus Chen', avatar: '', bio: 'Financial advisor & luxury travel expert.',
   trustScore: 96.8, verificationStatus: 'verified', rating: 4.94, reviewCount: 248,
   hourlyRate: 22000, specialties: ['Travel', 'Business', 'Wellness'],
   languages: ['English', 'Mandarin'], isAvailable: true, memberSince: '2023-08-15T00:00:00Z'},
];

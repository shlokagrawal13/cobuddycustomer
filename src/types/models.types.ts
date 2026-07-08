import type {ID, Timestamp, Currency, MembershipTier, VerificationStatus} from './common.types';

export interface UserProfile {
  id: ID; name: string; avatar?: string; bio?: string; phone: string; email?: string;
  trustScore: number; membershipTier: MembershipTier; verificationStatus: VerificationStatus;
  interests: string[]; language: string; createdAt: Timestamp;
}

export interface Companion {
  id: ID; name: string; avatar: string; bio: string; trustScore: number;
  verificationStatus: VerificationStatus; rating: number; reviewCount: number;
  hourlyRate: Currency; specialties: string[]; languages: string[];
  isAvailable: boolean; memberSince: Timestamp;
}

export interface AvailabilitySlot {
  id: ID; companionId: ID; startTime: Timestamp; endTime: Timestamp;
  isAvailable: boolean; price: Currency;
}

export interface Venue {
  id: ID; name: string; description: string; address: string;
  coordinates: {lat: number; lng: number}; images: string[];
  category: string; priceLevel: 1 | 2 | 3 | 4; rating: number; isPartner: boolean;
}

export interface Event {
  id: ID; title: string; description: string; venueId: ID;
  startTime: Timestamp; endTime: Timestamp; images: string[];
  ticketPrice: Currency; vipPrice?: Currency; isVipAvailable: boolean; category: string;
}

export interface Session {
  id: ID; bookingId: ID; companionId: ID; companionName: string; companionAvatar: string;
  venueId?: ID; venueName?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startTime: Timestamp; endTime: Timestamp; arrivalVerified: boolean;
  safetyCheckInTime?: Timestamp; totalAmount: Currency; tipAmount?: Currency;
  rating?: number; feedback?: string;
}

export interface Booking {
  id: ID; sessionId: ID; companionId: ID; venueId?: ID; eventId?: ID;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  amount: Currency; creditsUsed: Currency;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethodId: ID; createdAt: Timestamp;
  refundStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Transaction {
  id: ID; type: 'charge' | 'refund' | 'credit' | 'tip' | 'reward';
  amount: Currency; currency: string; description: string; date: Timestamp;
  status: 'pending' | 'completed' | 'failed'; bookingId?: ID;
}

export interface PaymentMethod {
  id: ID; type: 'card' | 'wallet' | 'bank'; last4?: string; brand?: string;
  expiryMonth?: number; expiryYear?: number; isDefault: boolean;
}

export interface Conversation {
  id: ID; participantId: ID; participantName: string; participantAvatar: string;
  lastMessage: string; lastMessageTime: Timestamp; unreadCount: number; isActive: boolean;
}

export interface Message {
  id: ID; conversationId: ID; senderId: ID; content: string;
  type: 'text' | 'image' | 'voice' | 'system'; mediaUrl?: string;
  sentAt: Timestamp; readAt?: Timestamp;
}

export interface IncomingCall {
  callId: ID; callerId: ID; callerName: string; callerAvatar: string;
  callType: 'voice' | 'video'; startedAt: Timestamp;
}

export interface TrustedContact {
  id: ID; name: string; phone: string; relationship: string; notifyOnSOS: boolean;
}

export interface Reward {
  id: ID; title: string; description: string; points: number;
  expiresAt?: Timestamp; redeemed: boolean; category: string;
}

export interface IncidentReport {
  id?: ID; sessionId?: ID; type: string; description: string;
  mediaUrls?: string[]; submittedAt?: Timestamp;
}

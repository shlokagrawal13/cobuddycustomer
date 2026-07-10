import type {UserProfile, Session, Conversation, Message, IncomingCall, Booking, Transaction, PaymentMethod, Reward, TrustedContact, IncidentReport} from './models.types';
import type {Toast, MembershipTier, AccountStatus} from './common.types';

export interface AuthState {
  isAuthenticated: boolean; isOnboarded: boolean; isVerified: boolean;
  role: 'customer' | 'companion' | null; userId: string | null; phone: string | null;
  sessionToken: string | null; biometricEnabled: boolean; pinEnabled: boolean;
  language: string; waitlistStatus: 'pending' | 'approved' | 'rejected' | null;
}

export interface UserState {
  profile: UserProfile | null; trustScore: number | null;
  isLoading: boolean; accountStatus: AccountStatus;
  isIdentityVerified: boolean;
}

export interface BookingDraft {
  companionId?: string; slotId?: string; venueId?: string; eventId?: string;
  subtotal?: number; creditsApplied?: number; total?: number; paymentMethodId?: string;
}

export interface SessionState {
  activeSession: Session | null; upcomingSessions: Session[];
  sessionHistory: Session[]; currentBookingDraft: BookingDraft | null; isLoading: boolean;
}

export interface ConciergeState {
  conversations: Conversation[]; activeConversationId: string | null;
  messages: Record<string, Message[]>; incomingCall: IncomingCall | null;
  activeCallId: string | null; unreadTotal: number; isLoadingConversations: boolean;
}

export interface CheckoutState {
  companionId?: string; slotId?: string; venueId?: string; eventId?: string;
  subtotal: number; creditsApplied: number; total: number; paymentMethodId?: string;
  status: 'idle' | 'processing' | 'success' | 'failed';
}

export interface BookingState {
  bookingHistory: Booking[]; activeBookingId: string | null;
  checkout: CheckoutState; isLoading: boolean;
}

export interface WalletState {
  balance: number; currency: string; credits: number; transactions: Transaction[];
  paymentMethods: PaymentMethod[]; rewards: Reward[]; loyaltyPoints: number;
  membershipTier: MembershipTier; isLoading: boolean;
}

export interface SafetyState {
  trustedContacts: TrustedContact[]; sosActive: boolean; sosSessionId: string | null;
  lastCheckIn: string | null; incidentDraft: IncidentReport | null; safetyScore: number | null;
}

export interface UIState {
  theme: 'dark' | 'light' | 'system'; resolvedTheme: 'dark' | 'light';
  tabBarVisible: boolean; sosButtonVisible: boolean; toastQueue: Toast[];
  activeModal: string | null; isKeyboardVisible: boolean; networkStatus: 'online' | 'offline';
}

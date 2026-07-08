import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ConciergeStackParamList} from '../../navigation/types';
import Icon from '../../components/ui/Icon';
import {Colors} from '../../theme/colors';

type Props = NativeStackScreenProps<ConciergeStackParamList, 'MessagingThread'>;

const {width: SW} = Dimensions.get('window');

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// ── Context-aware conversation map ──────────────────────────────────────────
type ConvoMeta = {
  name: string;
  role: string;
  trustCompatibility: string;
  hospitalityAlignment: string;
  conciergeStatus: string;
  badges: string[];
  introMessage: string;
};

const CONVO_MAP: Record<string, ConvoMeta> = {
  booking_assistance: {
    name: 'Bookings Concierge',
    role: 'Bookings & Reservations — CoBuddy',
    trustCompatibility: 'High',
    hospitalityAlignment: 'Luxury',
    conciergeStatus: 'Active',
    badges: ['Booking Specialist', 'Reservation Expert', 'Premium Support'],
    introMessage:
      'Hello and welcome to Booking Assistance. I can help you with upcoming reservations, session modifications, cancellations, and venue selection. How may I assist you today?',
  },
  safety_support: {
    name: 'Safety & Trust Team',
    role: 'Safety & Trust — CoBuddy',
    trustCompatibility: 'Verified',
    hospitalityAlignment: 'Priority',
    conciergeStatus: 'Active',
    badges: ['Safety Certified', 'Trust Verified', 'Priority Response'],
    introMessage:
      'You have reached the Safety & Trust team. All reports are handled with complete confidentiality. If you have an urgent concern, please describe the situation and we will escalate immediately.',
  },
  payment_help: {
    name: 'Payments Concierge',
    role: 'Payments & Refunds — CoBuddy',
    trustCompatibility: 'High',
    hospitalityAlignment: 'Premium',
    conciergeStatus: 'Active',
    badges: ['Billing Specialist', 'Refund Processing', 'Secure Payments'],
    introMessage:
      'Hello. I am your Payments Concierge. I can assist with billing inquiries, refund status, receipt requests, and payment method issues. Please describe your concern.',
  },
  account_support: {
    name: 'Account Concierge',
    role: 'Account & Membership — CoBuddy',
    trustCompatibility: 'High',
    hospitalityAlignment: 'Luxury',
    conciergeStatus: 'Active',
    badges: ['Account Specialist', 'Membership Expert', 'Privacy Compliant'],
    introMessage:
      'Welcome to Account Support. I can help with profile settings, privacy controls, membership tier management, and account-level concerns. How can I help you today?',
  },
  concierge_ai: {
    name: 'AI Concierge',
    role: 'AI-Powered Assistant — CoBuddy',
    trustCompatibility: 'High',
    hospitalityAlignment: 'Intelligent',
    conciergeStatus: 'Active',
    badges: ['AI Powered', 'Always Available', 'Instant Responses'],
    introMessage:
      'Hello! I am your AI Concierge. Ask me anything about your bookings, venues, companions, or membership — I am here to help around the clock.',
  },
};

const DEFAULT_CONVO: ConvoMeta = {
  name: 'Concierge Team',
  role: 'Live Concierge — CoBuddy',
  trustCompatibility: 'High',
  hospitalityAlignment: 'Luxury',
  conciergeStatus: 'Active',
  badges: ['Trusted Communication', 'Concierge Introduced', 'Premium Match'],
  introMessage:
    'Good afternoon. Welcome to CoBuddy concierge. How may I assist you today?',
};

type Message = {
  id: string;
  sender: 'them' | 'me' | 'system';
  text?: string;
  time: string;
  type?: 'venue' | 'voice';
  venueName?: string;
  venueLocation?: string;
  venueId?: string;
};

function buildInitialMessages(intro: string): Message[] {
  return [
    {
      id: 'divider_1',
      sender: 'system',
      text: 'Today, ' + new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}),
      time: '',
    },
    {
      id: 'msg_intro',
      sender: 'them',
      text: intro,
      time: new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}),
    },
  ];
}

// ── Mock auto-reply pool ──────────────────────────────────────────────────────
const MOCK_REPLIES = [
  'Understood. I\'ll arrange that for you immediately.',
  'Your request has been noted. Allow me a moment to confirm availability.',
  'Excellent. I\'ll have confirmation for you shortly.',
  'Of course. Your preferences have been recorded for this experience.',
  'Noted. Our team will follow up with full details within the hour.',
];
let replyIndex = 0;

// ── Component ─────────────────────────────────────────────────────────────────
export default function MessagingThreadScreen({navigation, route}: Props) {
  const convo = CONVO_MAP[route.params.conversationId] ?? DEFAULT_CONVO;
  const [messages, setMessages] = useState<Message[]>(() => buildInitialMessages(convo.introMessage));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Typing indicator - 3 dots animated opacity
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isTyping) return;
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {toValue: 1,   duration: 300, useNativeDriver: true}),
          Animated.timing(dot, {toValue: 0.3, duration: 300, useNativeDriver: true}),
        ]),
      );
    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 180);
    const a3 = pulse(dot3, 360);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [isTyping, dot1, dot2, dot3]);

  const sendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const now = new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      text: trimmed,
      time: now,
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 100);

    // Trigger typing indicator then auto-reply
    setIsTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: `reply_${Date.now()}`,
        sender: 'them',
        text: MOCK_REPLIES[replyIndex % MOCK_REPLIES.length],
        time: new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}),
      };
      replyIndex += 1;
      setIsTyping(false);
      setMessages(prev => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 100);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Icon name="support-agent" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerName}>{convo.name}</Text>
            <View style={styles.headerOnline}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerRole}>{convo.role}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('VoiceVideoCall', {callId: route.params.conversationId, callType: 'voice'})}
            activeOpacity={0.7}>
            <Icon name="call" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() =>
              Alert.alert(
                'Conversation Options',
                undefined,
                [
                  {
                    text: 'Mute Conversation',
                    onPress: () =>
                      Alert.alert('Muted', 'Notifications for this conversation have been muted.'),
                  },
                  {
                    text: 'View Concierge Profile',
                    onPress: () =>
                      (navigation as any).navigate('HomeNavigator', {
                        screen: 'CompanionProfile',
                        params: {companionId: 'concierge_elena'},
                      }),
                  },
                  {
                    text: 'Report Concern',
                    style: 'destructive' as const,
                    onPress: () =>
                      (navigation as any).navigate('SafetyNavigator', {screen: 'IncidentReport', params: {}}),
                  },
                  {text: 'Cancel', style: 'cancel' as const},
                ],
              )
            }
            activeOpacity={0.7}>
            <Icon name="more-vert" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Trusted overview strip ───────────────────────────────────────── */}
      <View style={styles.overviewStrip}>
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>TRUST</Text>
          <Text style={styles.overviewValue}>{convo.trustCompatibility}</Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>ALIGNMENT</Text>
          <Text style={styles.overviewValue}>{convo.hospitalityAlignment}</Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>CONCIERGE</Text>
          <Text style={[styles.overviewValue, {color: Colors.success}]}>{convo.conciergeStatus}</Text>
        </View>
      </View>

      {/* ── Trust Compatibility Card ─────────────────────────────────────── */}
      {/* Stitch: trust_compatibility_overview_card                           */}
      <View style={styles.trustCard}>
        {/* Top row: icon + heading + match score */}
        <View style={styles.trustCardHeader}>
          <View style={styles.trustAvatarWrap}>
            <Icon name="verified-user" size={18} color={Colors.success} />
          </View>
          <View style={styles.trustCardMeta}>
            <Text style={styles.trustCardTitle}>Trust Compatibility</Text>
            <Text style={styles.trustCardSub}>Concierge-verified · Identity Matched</Text>
          </View>
          <View style={styles.trustScorePill}>
            <Text style={styles.trustScoreText}>94%</Text>
          </View>
        </View>
        {/* Pillar chips row */}
        <View style={styles.trustChipsRow}>
          <View style={styles.trustChip}>
            <Icon name="verified" size={10} color={Colors.success} />
            <Text style={styles.trustChipText}>Trusted</Text>
          </View>
          <View style={styles.trustChip}>
            <Icon name="shield" size={10} color={Colors.info} />
            <Text style={styles.trustChipText}>Identity Verified</Text>
          </View>
          <View style={styles.trustChip}>
            <Icon name="star" size={10} color={Colors.primary} />
            <Text style={styles.trustChipText}>Premium Match</Text>
          </View>
        </View>
        {/* Badge row */}
        <View style={styles.trustBadgesRow}>
          {convo.badges.map(b => (
            <View key={b} style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Concierge banner ─────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.conciergeBanner}
        onPress={() => {
          // Guard: if already on the AI thread, show mode info instead of pushing again
          if (route.params.conversationId === 'concierge_ai') {
            Alert.alert(
              'AI Concierge Mode',
              'You are already in the AI Concierge conversation. Ask any question and the AI assistant will respond.',
              [{text: 'Got it'}],
            );
          } else {
            navigation.push('MessagingThread', {conversationId: 'concierge_ai'});
          }
        }}
        activeOpacity={0.85}>
        <Icon name="smart-toy" size={18} color={Colors.primary} />
        <Text style={styles.conciergeBannerText}>Talk To Conversation Concierge</Text>
        <Icon name="arrow-forward" size={16} color={Colors.primary} />
      </TouchableOpacity>

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesArea}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated: false})}>

        {messages.map(msg => {
          // Time divider
          if (msg.sender === 'system' && !msg.type) {
            return (
              <View key={msg.id} style={styles.timeDivider}>
                <Text style={styles.timeDividerText}>{msg.text}</Text>
              </View>
            );
          }

          // Venue card system message
          if (msg.sender === 'system' && msg.type === 'venue') {
            return (
              <View key={msg.id} style={styles.conciergeInterjection}>
                <Icon name="auto-awesome" size={16} color={Colors.primary} />
                <View style={styles.conciergeInterjectionBody}>
                  <Text style={styles.conciergeInterjectionTitle}>Concierge Suggestion</Text>
                  <Text style={styles.conciergeInterjectionText}>{msg.text}</Text>
                  {/* Venue card */}
                  <View style={styles.venueCard}>
                    <View style={styles.venueCardHeader}>
                      <View style={styles.venueCardHeaderBg}>
                        <Text style={styles.venueCardBgIcon}>V</Text>
                      </View>
                      <View style={styles.venueMatchBadge}>
                        <Text style={styles.venueMatchText}>MATCH</Text>
                      </View>
                    </View>
                    <View style={styles.venueCardBody}>
                      <Text style={styles.venueCardName}>{msg.venueName}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
                        <Icon name="location-on" size={12} color={Colors.outline} />
                        <Text style={styles.venueCardLocation}>{msg.venueLocation}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.venueReserveBtn}
                        onPress={() =>
                          (navigation as any).navigate('ModalNavigator', {
                            screen: 'VIPEventReservation',
                            params: {eventId: msg.venueId ?? 'venue_concierge_001'},
                          })
                        }
                        activeOpacity={0.85}>
                        <Text style={styles.venueReserveBtnText}>Quick Reservation</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }

          // Incoming message
          if (msg.sender === 'them') {
            return (
              <View key={msg.id} style={styles.incomingRow}>
                <View style={styles.incomingAvatar}>
                  <Icon name="support-agent" size={16} color={Colors.primary} />
                </View>
                <View style={styles.incomingBubbleWrap}>
                  <View style={styles.incomingBubble}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                  </View>
                  <Text style={styles.msgTime}>{msg.time} - Delivered</Text>
                </View>
              </View>
            );
          }

          // Outgoing message
          if (msg.sender === 'me') {
            return (
              <View key={msg.id} style={styles.outgoingRow}>
                <View style={styles.outgoingBubbleWrap}>
                  <View style={styles.outgoingBubble}>
                    <Text style={[styles.bubbleText, styles.outgoingBubbleText]}>{msg.text}</Text>
                  </View>
                  <Text style={[styles.msgTime, styles.msgTimeRight]}>{msg.time} - Read</Text>
                </View>
              </View>
            );
          }

          return null;
        })}

        {/* ── Typing indicator ─────────────────────────────────────────────── */}
        {isTyping && (
          <View style={styles.incomingRow}>
            <View style={styles.incomingAvatar}>
              <Icon name="support-agent" size={16} color={Colors.primary} />
            </View>
            <View style={[styles.incomingBubble, styles.typingBubble]}>
              <Animated.View style={[styles.typingDot, {opacity: dot1}]} />
              <Animated.View style={[styles.typingDot, {opacity: dot2}]} />
              <Animated.View style={[styles.typingDot, {opacity: dot3}]} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Input Bar ─────────────────────────────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.inputActionBtn}
            onPress={() => navigation.navigate('ChatMediaPicker', {conversationId: route.params.conversationId})}
            activeOpacity={0.7}>
            <Icon name="add" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Share a hospitality recommendation..."
            placeholderTextColor={Colors.outline}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            style={styles.inputActionBtn}
            onPress={() =>
              Alert.alert(
                'Voice Message',
                'Voice messages require microphone permission. This feature will be enabled in the production build.',
                [{text: 'OK'}],
              )
            }
            activeOpacity={0.7}>
            <Icon name="mic" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim().length > 0 && styles.sendBtnActive]}
            onPress={sendMessage}
            activeOpacity={0.85}>
            <Icon name="send" size={20} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  bg: Colors.surface,
  surface: Colors.surfaceContainer,
  surfaceHigh: Colors.surfaceContainerHigh,
  surfaceCard: Colors.surfaceContainerLow,
  gold: Colors.primary,
  onGold: Colors.onPrimary,
  text: Colors.onSurface,
  textMuted: Colors.onSurfaceVariant,
  outline: 'rgba(255,255,255,0.07)',
  goldDim: 'rgba(242,202,80,0.12)',
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bg},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.outline,
    backgroundColor: Colors.surfaceContainerLow,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {color: C.text, fontSize: 20},
  headerCenter: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10},
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.goldDim,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {color: C.text, fontSize: 15, fontWeight: '600'},
  headerOnline: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2},
  onlineDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success},
  headerRole: {color: C.textMuted, fontSize: 11},
  headerActions: {flexDirection: 'row', gap: 8},
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnIcon: {fontSize: 14},

  // Overview strip
  overviewStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: C.surfaceCard,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.outline,
  },
  overviewItem: {alignItems: 'center'},
  overviewLabel: {color: C.textMuted, fontSize: 9, fontWeight: '600', letterSpacing: 1, marginBottom: 3},
  overviewValue: {color: C.text, fontSize: 13, fontWeight: '600'},
  overviewDivider: {width: 1, height: 28, backgroundColor: C.outline},

  // Concierge banner
  // Trust compatibility card
  trustCard: {
    backgroundColor: C.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: C.outline,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  trustCardHeader: {flexDirection: 'row', alignItems: 'center', gap: 10},
  trustAvatarWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  trustCardMeta: {flex: 1},
  trustCardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.text, marginBottom: 2},
  trustCardSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: C.textMuted},
  trustScorePill: {
    backgroundColor: C.goldDim,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.22)',
  },
  trustScoreText: {fontFamily: 'Inter-Bold', fontSize: 13, color: C.gold},
  trustChipsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  trustChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.surfaceHigh,
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: C.outline,
  },
  trustChipText: {fontFamily: 'Inter-Regular', fontSize: 10, color: C.text},
  trustBadgesRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  trustBadge: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: C.outline,
  },
  trustBadgeText: {fontFamily: 'Inter-Regular', fontSize: 10, color: C.textMuted},

  conciergeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.goldDim,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242,202,80,0.15)',
  },
  conciergeBannerText: {flex: 1, color: C.text, fontSize: 13, fontWeight: '500'},
  conciergeBannerArrow: {color: C.gold, fontSize: 16, fontWeight: '700'},

  // Messages
  messagesArea: {flex: 1},
  messagesContent: {padding: 16, gap: 16},

  // Time divider
  timeDivider: {alignItems: 'center'},
  timeDividerText: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },

  // Concierge interjection
  conciergeInterjection: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(20,20,15,0.8)',
    borderWidth: 1,
    borderColor: C.outline,
    borderRadius: 20,
    padding: 16,
    alignSelf: 'center',
    maxWidth: SW * 0.88,
  },
  conciergeInterjectionIcon: {fontSize: 20, marginTop: 2},
  conciergeInterjectionBody: {flex: 1, gap: 8},
  conciergeInterjectionTitle: {color: C.text, fontSize: 13, fontWeight: '600'},
  conciergeInterjectionText: {color: C.textMuted, fontSize: 13, lineHeight: 18},

  // Venue card
  venueCard: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.outline,
    overflow: 'hidden',
    marginTop: 6,
  },
  venueCardHeader: {
    height: 80,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  venueCardHeaderBg: {alignItems: 'center', justifyContent: 'center'},
  venueCardBgIcon: {fontSize: 36},
  venueMatchBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(20,20,15,0.75)',
    borderWidth: 1,
    borderColor: C.outline,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  venueMatchText: {color: C.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1},
  venueCardBody: {padding: 12, gap: 6},
  venueCardName: {color: C.text, fontSize: 14, fontWeight: '600'},
  venueCardLocation: {color: C.textMuted, fontSize: 12, marginBottom: 6},
  venueReserveBtn: {
    backgroundColor: C.gold,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  venueReserveBtnText: {color: C.onGold, fontSize: 13, fontWeight: '600'},

  // Incoming
  incomingRow: {flexDirection: 'row', gap: 10, alignItems: 'flex-end', maxWidth: SW * 0.82},
  incomingAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  incomingBubbleWrap: {gap: 4},
  incomingBubble: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: C.outline,
  },

  // Outgoing
  outgoingRow: {flexDirection: 'row', justifyContent: 'flex-end', maxWidth: SW * 0.82, alignSelf: 'flex-end'},
  outgoingBubbleWrap: {gap: 4, alignItems: 'flex-end'},
  outgoingBubble: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
  },
  outgoingBubbleText: {},

  // Typing indicator bubble
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    minWidth: 64,
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.onSurfaceVariant,
  },

  // Shared bubble
  bubbleText: {color: C.text, fontSize: 14, lineHeight: 20},
  msgTime: {color: 'rgba(208,197,175,0.5)', fontSize: 11, marginLeft: 4},
  msgTimeRight: {marginLeft: 0, marginRight: 4},

  // Input bar
  inputBar: {
    backgroundColor: 'rgba(20,20,15,0.97)',
    borderTopWidth: 1,
    borderTopColor: C.outline,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.surface,
    margin: 10,
    marginBottom: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.outline,
  },
  inputActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputActionIcon: {color: C.textMuted, fontSize: 18},
  input: {
    flex: 1,
    color: C.text,
    fontSize: 14,
    paddingVertical: 0,
    maxHeight: 80,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {backgroundColor: C.gold},
  sendBtnIcon: {color: C.text, fontSize: 16, fontWeight: '700'},
});





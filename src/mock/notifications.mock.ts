export const MOCK_NOTIFICATIONS = [
  {id: 'notif_001', type: 'session', title: 'Session Tomorrow', message: 'Your session with Sophia Laurent is tomorrow at 7pm.', readAt: null, createdAt: new Date().toISOString()},
  {id: 'notif_002', type: 'reward', title: 'Points Earned', message: 'You earned 500 loyalty points from your last session.', readAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString()},
];

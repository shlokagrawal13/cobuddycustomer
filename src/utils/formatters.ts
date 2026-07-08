export function formatCurrency(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(cents / 100);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString('en-US', opts ?? {month: 'short', day: 'numeric', year: 'numeric'});
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) {return 'just now';}
  if (mins < 60) {return `${mins}m ago`;}
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) {return `${hrs}h ago`;}
  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatTrustScore(score: number): string {
  return score.toFixed(1);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

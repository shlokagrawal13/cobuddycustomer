export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^\+?[1-9]\d{7,14}$/.test(cleaned);
}

export function isValidOTP(otp: string, length = 6): boolean {
  const pattern = new RegExp(`^\\d{${length}}$`);
  return pattern.test(otp);
}

export function isValidPIN(pin: string, length = 6): boolean {
  const pattern = new RegExp(`^\\d{${length}}$`);
  return pattern.test(pin);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

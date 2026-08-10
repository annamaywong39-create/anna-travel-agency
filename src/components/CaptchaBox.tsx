interface CaptchaBoxProps {
  value: string;
  onChange: (token: string) => void;
}

// CAPTCHA is currently disabled while the project uses email verification,
// Supabase rate limits, and the login cooldown. Keep this component so CAPTCHA
// can be enabled later without changing the auth forms again.
export default function CaptchaBox(_props: CaptchaBoxProps) {
  return null;
}

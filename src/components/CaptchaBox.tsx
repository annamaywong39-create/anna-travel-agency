import { Turnstile } from '@marsidev/react-turnstile';

interface CaptchaBoxProps {
  value: string;
  onChange: (token: string) => void;
}

export default function CaptchaBox({ value, onChange }: CaptchaBoxProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <div className="my-4 min-h-[65px]" aria-label="Security verification">
      <Turnstile
        siteKey={siteKey}
        options={{ theme: 'auto', size: 'flexible' }}
        onSuccess={onChange}
        onExpire={() => onChange('')}
        onError={() => onChange('')}
      />
      {!value && <p className="mt-1 text-xs text-gray-500">Complete the security check to continue.</p>}
    </div>
  );
}

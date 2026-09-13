/* ==========================================================================
   SOCIAL BRAND ICONS
   Shared inline SVG icons used by the Footer and the Profile contact
   section, so both stay visually identical without duplicating markup.
   ========================================================================== */

interface SocialIconProps {
  className?: string;
}

export function FacebookIcon({
  className = "h-5 w-5",
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.1c0-.87.29-1.46 1.55-1.46h1.65V4.96c-.29-.04-1.28-.13-2.43-.13-2.4 0-4.05 1.47-4.05 4.17V11H7.5v3h2.72v8h3.28Z" />
    </svg>
  );
}

export function InstagramIcon({
  className = "h-5 w-5",
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.3"
        cy="6.7"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function TikTokIcon({
  className = "h-5 w-5",
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M15.2 3c.2 1.7 1.2 3.1 2.8 3.8.7.3 1.4.5 2.2.5v3.1a8.5 8.5 0 0 1-2.2-.3 8.1 8.1 0 0 1-2.8-1.4v6.1c0 3.4-2.7 6.2-6.2 6.2A6.2 6.2 0 0 1 2.8 15c0-3.4 2.7-6.2 6.2-6.2.3 0 .6 0 .9.1V12a3.2 3.2 0 0 0-.9-.1A3.1 3.1 0 1 0 12.1 15V3h3.1Z" />
    </svg>
  );
}

export function WhatsAppIcon({
  className = "h-5 w-5",
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 17.9c-1.5 0-2.9-.4-4.1-1.2l-.3-.2-3.1.8.8-3-.2-.3A7.9 7.9 0 1 1 12 19.9Zm4.3-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.3-1.3-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}

export function ViberIcon({
  className = "h-5 w-5",
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.7 2.7C14.8.8 8.7.7 5.8 2.5 3.2 4.1 2.5 7.3 2.5 11c0 3.8.7 6.9 3.2 8.5l.9.5-.6 2.8c-.1.5.4.8.8.5l3.2-1.9c1.6.3 4.3.3 6-.1 2.9-.8 4.7-2.8 5.1-6 .5-3.7.2-9.8-3.4-12.6ZM19 14.8c-.3 2.4-1.5 3.8-3.7 4.4-1.5.4-4 .4-5.5.1l-.4-.1-2.2 1.3.4-2-.4-.2c-1.9-.9-2.5-2.9-2.5-5.4 0-3.1.5-5.5 2.4-6.7 2.3-1.4 7.5-1.3 9.8.2 2.5 1.6 2.5 6.8 2.1 8.4Zm-3.4-1.6c-.3-.2-1.8-1-2.1-1.1-.3-.1-.5-.2-.7.2-.2.3-.7 1.1-.9 1.3-.2.2-.3.2-.6.1-1.4-.7-2.4-1.6-3.2-3-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-.9-2.3-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.9.6.3 1.1.5 1.5.6.6.2 1.1.2 1.5.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.1-.5-.2Z" />
    </svg>
  );
}

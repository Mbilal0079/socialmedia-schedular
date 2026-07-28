export const PLATFORMS = [
  { name: "X (Twitter)", color: "#1DA1F2", symbol: "𝕏", bg: "#1DA1F220" },
  { name: "LinkedIn",    color: "#0A66C2", symbol: "in", bg: "#0A66C220" },
  { name: "Facebook",   color: "#1877F2", symbol: "f",  bg: "#1877F220" },
  { name: "Instagram",  color: "#E1306C", symbol: "◈",  bg: "#E1306C20" },
];

export const FEATURES = [
  {
    icon: "⏰",
    title: "Precise Scheduling",
    desc: "Pick any future date and time. PostPilot calculates the exact delay and fires your post to the millisecond — every time.",
    grad: "linear-gradient(135deg,#7C3AED,#A855F7)",
  },
  {
    icon: "🔄",
    title: "Auto-Retry Queue",
    desc: "If a publish fails, BullMQ retries automatically up to 3 times with exponential backoff. No silent failures.",
    grad: "linear-gradient(135deg,#3B82F6,#06B6D4)",
  },
  {
    icon: "📅",
    title: "Content Calendar",
    desc: "See your full pipeline at a glance. Every scheduled post mapped out so you can plan weeks ahead without overlap.",
    grad: "linear-gradient(135deg,#A855F7,#EC4899)",
  },
  {
    icon: "📊",
    title: "Publish Analytics",
    desc: "Track success rates, failed jobs, platform-level results, and reach — all in one unified dashboard.",
    grad: "linear-gradient(135deg,#06B6D4,#3B82F6)",
  },
  {
    icon: "🌐",
    title: "Multi-Platform",
    desc: "One post, four destinations. Write once and publish to Twitter, LinkedIn, Facebook, and Instagram simultaneously.",
    grad: "linear-gradient(135deg,#22C55E,#06B6D4)",
  },
  {
    icon: "🖼️",
    title: "Media Attachments",
    desc: "Upload images once, attach to any post. Files stored on Cloudinary CDN and reusable across your library.",
    grad: "linear-gradient(135deg,#F59E0B,#EF4444)",
  },
];

export const STEPS = [
  {
    icon: "🔗",
    title: "Connect Accounts",
    desc: "OAuth into Twitter, LinkedIn, Facebook, and Instagram in seconds. Tokens encrypted and stored securely.",
  },
  {
    icon: "✍️",
    title: "Write Your Post",
    desc: "One composer, all platforms. Add images, write your caption, and see exactly how it looks per channel.",
  },
  {
    icon: "📆",
    title: "Pick a Time",
    desc: "Choose your date and time. PostPilot adds the job to the BullMQ queue with the precise delay calculated.",
  },
  {
    icon: "🚀",
    title: "Auto-Published",
    desc: "The background worker fires at the scheduled time, publishes everywhere, logs results, and retries on failure.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Content Creator · 120K followers",
    body: "I scheduled 30 posts in 20 minutes. The queue dashboard shows exactly what's pending and what published. Zero surprises.",
    avatar: "SK",
    stars: 5,
  },
  {
    name: "Raza M.",
    role: "Startup Founder · Lahore",
    body: "Every other tool missed posts or published at the wrong time. PostPilot's queue is rock-solid. Not one failure in 3 months.",
    avatar: "RM",
    stars: 5,
  },
  {
    name: "Zara T.",
    role: "Marketing Lead · Agency",
    body: "Managing 8 client accounts used to mean 8 different tools. Now it's one dashboard, one queue, everything visible.",
    avatar: "ZT",
    stars: 5,
  },
];

export const PLANS = [
  {
    name: "Starter",
    price: "0",
    period: "forever",
    tag: null,
    desc: "For individuals starting out.",
    features: [
      "3 scheduled posts / day",
      "2 social accounts",
      "Twitter & LinkedIn",
      "3 auto-retries per post",
      "7-day history",
    ],
    cta: "Start Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "9",
    period: "per month",
    tag: "Most Popular",
    desc: "For creators who post consistently.",
    features: [
      "Unlimited scheduled posts",
      "All 4 platforms",
      "Image attachments",
      "Full analytics dashboard",
      "Priority queue processing",
      "30-day history",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    highlight: true,
  },
  {
    name: "Agency",
    price: "29",
    period: "per month",
    tag: null,
    desc: "For teams managing multiple brands.",
    features: [
      "Everything in Pro",
      "5 team seats",
      "20 social accounts",
      "Client-level reporting",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@postpilot.app",
    highlight: false,
  },
];

export const FAQS = [
  {
    q: "Do I need a credit card to start?",
    a: "No. The Starter plan is free forever. No payment info required until you choose to upgrade.",
  },
  {
    q: "Which platforms do you support?",
    a: "Twitter/X, LinkedIn, Facebook Pages, and Instagram Business accounts. All four publish simultaneously from one post.",
  },
  {
    q: "What happens if a post fails to publish?",
    a: "PostPilot retries automatically up to 3 times using exponential backoff (2s, 4s, 8s delays). If all retries fail, you get a clear error in your analytics dashboard so you can reschedule.",
  },
  {
    q: "How far in advance can I schedule?",
    a: "As far as you want — days, weeks, months. The BullMQ worker calculates the exact delay and fires at precisely the right moment.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. OAuth tokens are encrypted at rest. We never store your social passwords. You can disconnect any account from Settings at any time.",
  },
];

export const NAV_LINKS = [
  { label: "Features",    href: "#features" },
  { label: "Pricing",     href: "#pricing" },
  { label: "How It Works",href: "#how-it-works" },
  { label: "FAQ",         href: "#faq" },
];

export const STATS = [
  { value: "1,200+", label: "Creators & growing" },
  { value: "5K+",    label: "Posts Queued" },
  { value: "99.9%",  label: "Delivery Rate" },
  { value: "4",      label: "Platforms" },
];

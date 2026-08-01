import { Link } from "react-router-dom";

const HEAD = "#0E4174";

/**
 * Editorial press card. `variant` controls density:
 *  - "compact"  : small thumb + title (popular list)
 *  - "standard" : default card used in the Latest grid
 *  - "feature"  : larger image, longer copy, used in the Featured row
 *  - "ceo"      : tall image with full-bleed card and dark-on-paper meta
 *
 * Typography matches the rest of the site:
 *  - Headlines  → Ivy Presto, light
 *  - Body/meta  → Aktiv Grotesk
 */
function PressCard({ post, variant = "standard", className = "" }) {
  if (!post) return null;
  const to = `/news-and-insights/${post.slug}`;

  if (variant === "compact") {
    return (
      <Link
        to={to}
        className={`group grid grid-cols-[78px_1fr] items-center gap-5 ${className}`}
      >
        <span className="block h-[78px] overflow-hidden bg-[#f4f1ea]">
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        </span>
        <span>
          <h4
            className="font-['Ivy_Presto'] text-[15px] font-normal leading-[1.32] tracking-[-0.01em]"
            style={{ color: HEAD }}
          >
            {post.title}
          </h4>
          <small className="mt-2 block font-['Aktiv_Grotesk'] text-[9px] font-medium uppercase tracking-[0.22em] text-[#77736a]">
            {post.category} · {post.date}
          </small>
        </span>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <article className={`flex flex-col ${className}`}>
        <Link to={to} className="group block">
          <div className="relative mb-7 h-[clamp(240px,28vw,320px)] overflow-hidden bg-[#f4f1ea]">
            <span
              className="absolute left-0 top-0 z-10 bg-[#0E4174] px-3 py-2 font-['Aktiv_Grotesk'] text-[9px] font-medium uppercase leading-none tracking-[0.26em] text-white"
            >
              {post.category}
            </span>
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
              style={{ filter: "saturate(.92)" }}
            />
          </div>
        </Link>
        <p className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.28em] text-[#77736a]">
          {post.date} · {post.readTime}
        </p>
        <Link to={to} className="group block">
          <h3
            className="mt-3 max-w-[460px] font-['Ivy_Presto'] text-[clamp(22px,2vw,28px)] font-light leading-[1.18] tracking-[-0.025em] transition-colors group-hover:text-[#163d6a]"
            style={{ color: HEAD }}
          >
            {post.title}
          </h3>
        </Link>
        <p className="mt-5 max-w-[440px] font-['Aktiv_Grotesk'] text-[14px] font-light leading-[1.75] text-[#615c54]">
          {post.excerpt}
        </p>
        <Link
          to={to}
          className="group mt-auto inline-flex items-center gap-3 pt-7 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#0E4174]"
        >
          <span>Read More</span>
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </article>
    );
  }

  if (variant === "ceo") {
    return (
      <Link
        to={to}
        className={`group flex flex-col bg-[#fbfaf6] transition-colors hover:bg-[#f4f1ea] ${className}`}
      >
        <div className="relative h-[220px] overflow-hidden bg-[#e8e2d4] sm:h-[250px] md:h-[270px]">
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
            style={{ filter: "saturate(.92)" }}
          />
          <span className="absolute left-0 top-0 bg-[#0E4174] px-3 py-2 font-['Aktiv_Grotesk'] text-[9px] font-medium uppercase leading-none tracking-[0.26em] text-white">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <p className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.28em] text-[#77736a]">
            {post.date} · {post.readTime}
          </p>
          <h3
            className="mt-3 font-['Ivy_Presto'] text-[clamp(18px,2.2vw,22px)] font-light leading-[1.22] tracking-[-0.02em] sm:mt-4"
            style={{ color: HEAD }}
          >
            {post.title}
          </h3>
          <p className="mt-3 font-['Aktiv_Grotesk'] text-[13px] font-light leading-[1.75] text-[#6f6a62] sm:mt-4 sm:text-[13.5px]">
            {post.excerpt}
          </p>
          <span className="mt-auto inline-flex min-h-[44px] items-center gap-3 pt-5 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#0E4174] sm:pt-7">
            <span>Read Post</span>
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    );
  }

  // Standard
  return (
    <article className={`flex min-h-0 flex-col sm:min-h-[420px] xl:min-h-[470px] ${className}`}>
      <Link to={to} className="group block">
        <div className="relative mb-5 h-[180px] overflow-hidden bg-[#f4f1ea] sm:mb-7 sm:h-[190px]">
          <span className="absolute left-0 top-0 z-10 bg-[#0E4174] px-3 py-2 font-['Aktiv_Grotesk'] text-[9px] font-medium uppercase leading-none tracking-[0.26em] text-white">
            {post.category}
          </span>
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
            style={{ filter: "saturate(.92)" }}
          />
        </div>
      </Link>
      <p className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.28em] text-[#77736a]">
        {post.date}
      </p>
      <Link to={to} className="group block">
        <h3
          className="mt-3 font-['Ivy_Presto'] text-[clamp(18px,2.2vw,21px)] font-light leading-[1.22] tracking-[-0.02em] transition-colors group-hover:text-[#163d6a]"
          style={{ color: HEAD }}
        >
          {post.title}
        </h3>
      </Link>
      <p className="mt-3 font-['Aktiv_Grotesk'] text-[13px] font-light leading-[1.75] text-[#6f6a62] sm:mt-4 sm:text-[13.5px]">
        {post.excerpt}
      </p>
      <Link
        to={to}
        className="group mt-auto inline-flex min-h-[44px] items-center gap-3 pt-5 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#0E4174] sm:pt-7"
      >
        <span>Read More</span>
        <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </article>
  );
}

export default PressCard;

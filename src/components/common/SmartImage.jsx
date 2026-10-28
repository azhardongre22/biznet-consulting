import { useState } from "react";

/**
 * Drop-in <img> replacement carrying the loading defaults we want everywhere.
 *
 * Below the fold (the default) the browser defers the request entirely.
 * Above-the-fold hero art - the LCP element - opts in with `priority`, so it
 * is fetched eagerly and at high priority instead of queueing behind the rest
 * of the page. Decoding is always async, so a large image can never block the
 * main thread while the rest of the page paints.
 *
 * The skeleton and fade are painted on the <img> itself rather than a wrapper:
 * an element with no decoded image shows its own background, so a placeholder
 * costs no extra DOM and can't disturb the `h-full w-full object-cover`
 * layouts these images sit in.
 */
const SmartImage = ({
  priority = false,
  skeleton = true,
  className = "",
  onLoad,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  // Priority images are on screen at first paint, so a skeleton behind them
  // would only ever flash.
  const placeholder = skeleton && !priority && !loaded;

  return (
    <img
      {...props}
      className={`${className}${
        placeholder ? " animate-pulse bg-black/5" : ""
      }${skeleton && !priority && loaded ? " animate-in fade-in duration-500" : ""}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      ref={(node) => {
        // A cached image can finish decoding before React attaches onLoad,
        // which would otherwise leave the skeleton up forever.
        if (node?.complete) setLoaded(true);
      }}
    />
  );
};

export default SmartImage;

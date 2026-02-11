import React from "react";
import { VirtualizedListProps } from "./VirtualizedList.types";
import { Scrollbar } from "react-scrollbars-custom";

export const VirtualizedList = <T,>(
  {
    items,
    itemHeight,
    renderItem,
    scrollToIndex,
    padding = 0,
  }: VirtualizedListProps<T>,
  forwardedRef: React.Ref<HTMLDivElement | null>,
) => {
  const itemsRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStartIndex, setVisibleStartIndex] = React.useState(0);
  const [containerRef, setContainerRef] = React.useState<HTMLDivElement | null>(
    null,
  );
  const scrollRef = React.useRef<Scrollbar | null>(null);

  const totalHeight = items.length * itemHeight;

  const handleScroll = () => {
    const el = scrollRef.current?.scrollerElement;
    if (el) {
      const scrollTop = el.scrollTop;
      const start = Math.floor((scrollTop - (padding || 0)) / itemHeight);
      setVisibleStartIndex(start);
    }
  };

  const containerHeight = containerRef?.clientHeight || 0;
  const visibleItemCount = Math.ceil((containerHeight / itemHeight) * 1.5);
  // To prevent flickering
  const extraItems = Math.floor(visibleItemCount / 2);
  const start = Math.max(visibleStartIndex - extraItems, 0);
  const end = visibleStartIndex + visibleItemCount + extraItems;

  React.useEffect(() => {
    if (scrollToIndex === undefined) return;

    const el = scrollRef.current?.scrollerElement;
    if (el) {
      el.scrollTop = Math.max(0, scrollToIndex - 2) * itemHeight;
    }
  }, [scrollToIndex, totalHeight, scrollRef.current]);

  return (
    <div
      ref={(el) => {
        setContainerRef(el);
        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (
          forwardedRef &&
          typeof forwardedRef === "object" &&
          "current" in forwardedRef
        ) {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = el;
        }
      }}
      style={{ overflowY: "auto", height: "100%", width: "100%" }}
    >
      <Scrollbar
        ref={scrollRef}
        style={{ height: "100%" }}
        onScroll={handleScroll}
      >
        <div
          style={{
            height: totalHeight + (padding || 0) * 2,
            position: "relative",
          }}
        >
          {items.slice(start, end + visibleItemCount).map((item, index) => (
            <div
              ref={(el) => {
                itemsRefs.current[index + start] = el;
              }}
              key={index}
              style={{
                position: "absolute",
                top: (padding || 0) + (start + index) * itemHeight,
                left: padding,
                right: padding,
              }}
            >
              {renderItem(item, start + index)}
            </div>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

VirtualizedList.displayName = "VirtualizedList";

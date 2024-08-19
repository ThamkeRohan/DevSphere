import { useEffect, useRef, useState } from "react";

export default function Slider({ children, breakPoints }) {
  const sliderScreenRef = useRef();
  const firstItemRef = useRef();
  const lastItemRef = useRef();
  const [itemLength, setItemLength] = useState(0);
  const [step, setStep] = useState(0);
  const [areExtemeItemsVisible, setAreExtremeItemsVisible] = useState({
    firstItem: true,
    lastItem: false,
  });
  const scrollLength = itemLength * step;
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((extremeItem) => {
          if (extremeItem.isIntersecting) {
            setAreExtremeItemsVisible((prev) => ({
              ...prev,
              [extremeItem.target.getAttribute("name")]: true,
            }));
          } else {
            setAreExtremeItemsVisible((prev) => ({
              ...prev,
              [extremeItem.target.getAttribute("name")]: false,
            }));
          }
        });
      },
      { threshold: 1 }
    );
    intersectionObserver.observe(firstItemRef.current);
    intersectionObserver.observe(lastItemRef.current);

    const resizeObserver = new ResizeObserver((entries) => {
      const sliderScreenLength = entries[0].contentRect.width;
      for (let breakPoint of breakPoints) {
        if (sliderScreenLength > breakPoint.width) {
          setItemLength(sliderScreenLength / breakPoint.itemsToShow);
          setStep(breakPoint.step);
          return;
        }
      }
      setItemLength(sliderScreenLength);
      setStep(1);
    });
    if (sliderScreenRef.current) {
      resizeObserver.observe(sliderScreenRef.current);
    }

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  function onNext() {
    sliderScreenRef.current.scrollLeft =
      sliderScreenRef.current.scrollLeft +
      getAdjustmentLength(sliderScreenRef.current, itemLength) +
      scrollLength;
  }
  function onPrevious() {
    sliderScreenRef.current.scrollLeft =
      sliderScreenRef.current.scrollLeft +
      getAdjustmentLength(sliderScreenRef.current, itemLength) -
      scrollLength;
  }
  const itemStyles = {
    minWidth: `${itemLength}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  };
  const sliderScreenStyles = {
    overflow: "auto",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    backgroundColor: "green",
    scrollBehavior: "smooth",
  };

  return (
    <div className="slider">
      <div style={sliderScreenStyles} ref={sliderScreenRef}>
        {children.map((child, index) => {
          if (index === 0) {
            return (
              <div
                name="firstItem"
                style={itemStyles}
                className="slider-item"
                key={index}
                ref={firstItemRef}
              >
                {child}
              </div>
            );
          } else if (index === children.length - 1) {
            return (
              <div
                name="lastItem"
                style={itemStyles}
                className="slider-item"
                key={index}
                ref={lastItemRef}
              >
                {child}
              </div>
            );
          } else {
            return (
              <div style={itemStyles} className="slider-item" key={index}>
                {child}
              </div>
            );
          }
        })}
      </div>
      {!areExtemeItemsVisible.firstItem && (
        <button type="button" onClick={onPrevious}>
          Previous
        </button>
      )}
      {!areExtemeItemsVisible.lastItem && (
        <button type="button" onClick={onNext}>
          Next
        </button>
      )}
    </div>
  );
}

function getAdjustmentLength(sliderScreen, itemLength) {
  const leftCutOffPortionLength = sliderScreen.scrollLeft % itemLength;
  if (leftCutOffPortionLength < itemLength / 2) {
    return -leftCutOffPortionLength;
  } else {
    return itemLength - leftCutOffPortionLength;
  }
}

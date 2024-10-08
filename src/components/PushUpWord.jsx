import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import FontFaceObserver from 'fontfaceobserver';

const PushUpWord = ({ word, alternate, wordClass, letterClass }) => {
  const [letters, setLetters] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);


  useEffect(() => {
    const font = new FontFaceObserver('Aquire');
    font.load().then(() => {
      setFontLoaded(true);
    }).catch((e) => {
      console.error('Font loading failed', e);
      setFontLoaded(true); // Proceed anyway to avoid blocking render
    });
  }, []);
  useEffect(() => {
    if (fontLoaded) {
      setLetters(
        word.split('').map((char, index) => ({
          char,
          ref: React.createRef(),
        }))
      );
    }
  }, [word, fontLoaded]);

  useEffect(() => {
    if (letters.length === 0) return;
    
    const timelines = letters.map((letterObj, index) => {
      const letterOut = letterObj.ref.current;
      const timeline = gsap.timeline({ paused: true });
      const direction = alternate ? (index % 2 === 0 ? -22 : 22) : -130;

      // Clone the letter
      const letterIn = letterOut.cloneNode(true);
      letterIn.style.position = 'absolute';
      letterIn.style.pointerEvents = 'none';
      letterOut.style.position = 'relative';
      letterOut.style.overflow = 'hidden';

      // Position the cloned letter exactly over the original letter
      letterIn.style.top = letterOut.offsetTop;
      letterIn.style.left = letterOut.offsetLeft + 'px';

      // Append the clone to the parent of the original letter
      letterOut.parentNode.style.position = 'relative';
      letterOut.parentNode.appendChild(letterIn);

      // Set up the animation timeline for letter based on if alternating
      timeline
        .to(letterOut, { y: direction, duration: alternate ? 0.5 : 0.3 })
        .fromTo(letterIn, { y: -direction }, { y: 0, duration: 0.5 }, 0);

      return timeline;
    });

    const parentElement = letters[0].ref.current.parentNode;
    parentElement.onmouseenter = () => {
      timelines.forEach((timeline) => {
        timeline.restart();
        timeline.play();
      });
    };

    // Cleanup function to remove the event listener and clear GSAP timelines
    return () => {
      parentElement.onmouseenter = null; // Remove event listener
      timelines.forEach((timeline) => {
        timeline.kill(); // Clear GSAP timelines
      });
    };
  }, [letters, alternate, fontLoaded]); // Include `letters`, `alternate`, and `fontLoaded` in the dependency array

  return (
    <div className={wordClass} style={{ overflow: 'hidden' }}>
      {letters.map((letterObj, i) => (
        <span
          key={i}
          ref={letterObj.ref}
          className={letterClass}
          style={{ userSelect: 'none' }}
        >
          {letterObj.char}
        </span>
      ))}
    </div>
  );
};

export default PushUpWord;

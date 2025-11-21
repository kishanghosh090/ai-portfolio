// "use client";

// import { useLottie } from "lottie-react";
// import groovyWalkAnimation from "@/public/Siri/animations/siributton.json";
// export default function SiriLottieButton({ listening, onClick }: any) {
//   const options = {
//     animationData: groovyWalkAnimation,
//     loop: true
//   };

//   const { View } = useLottie(options);

  
//     return <>{View}</>;

// }

"use client";

import Lottie from "lottie-react";
import animation from "@/public/Siri/animations/siributton.json";

export default function SiriLottieButton({ listening, onClick }: any) {
  return (
    <div className="w-24 h-24 cursor-pointer" onClick={onClick}>
      <Lottie
        animationData={animation}
        autoplay={listening}
        loop={listening}
        style={{ width: 110, height: 110 }}
      />
    </div>
  );
}

declare module "lottie-react";
declare module "@lottiefiles/react-lottie-player" {
  import * as React from "react";

  interface PlayerProps {
    autoplay?: boolean;
    loop?: boolean;
    keepLastFrame?: boolean;
    src: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  }

  export class Player extends React.Component<PlayerProps> {}
}

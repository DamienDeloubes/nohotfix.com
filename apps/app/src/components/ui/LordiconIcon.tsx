import { Player } from '@lordicon/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface LordiconIconHandle {
  play: () => void;
}

interface LordiconIconProps {
  icon: object;
  size?: number;
  colors?: string;
}

export const LordiconIcon = forwardRef<LordiconIconHandle, LordiconIconProps>(function LordiconIcon({ icon, size = 24, colors }, ref) {
  const playerRef = useRef<Player>(null);

  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playFromBeginning(),
  }));

  return <Player ref={playerRef} icon={icon} size={size} {...(colors ? { colorize: colors } : {})} />;
});

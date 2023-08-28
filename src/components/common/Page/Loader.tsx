import styled from 'styled-components';
import { useNProgress } from '@tanem/react-nprogress';

interface Props {
  isRouteChanging: boolean;
}

interface ContainerProps {
  isFinished: boolean;
  animationDuration: number;
}

interface BarProps {
  progress: number;
  animationDuration: number;
}

const Container = styled.div<ContainerProps>`
  opacity: ${(props) => (props.isFinished ? 0 : 1)};
  pointer-events: none;
  transition: opacity ${(props) => props.animationDuration}ms linear;
`;

const Bar = styled.div<BarProps>`
  background: #4f75dd;
  height: 3px;
  left: 0;
  margin-left: ${(props) => (-1 + props.progress) * 100}%;
  position: fixed;
  top: 0;
  transition: margin-left ${(props) => props.animationDuration}ms linear;
  width: 100%;
  z-index: 1031;
`;

const Spinner = styled.div`
  box-shadow: 0 0 10px #4f75dd, 0 0 5px #4f75dd;
  display: block;
  height: 100%;
  opacity: 1;
  position: absolute;
  right: 0;
  transform: rotate(3deg) translate(0px, -4px);
  width: 100px;
`;

export function PageLoader({ isRouteChanging }: Props) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging,
  });

  return (
    <Container isFinished={isFinished} animationDuration={animationDuration}>
      <Bar progress={progress} animationDuration={animationDuration}>
        <Spinner />
      </Bar>
    </Container>
  );
}

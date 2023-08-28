import { ArrowLeftOutlined } from '@ant-design/icons';
import { SecondaryText } from 'src/components/common/Text';
import { Container, NavigationBox, StepTitle } from './StepBar.styled';

interface Props {
  step: number;
  total: number;
  title: string;
  cta?: React.ReactNode;
  onBack?: () => unknown;
}

export function StepBar({ step, total, title, cta, onBack }: Props) {
  return (
    <Container>
      <NavigationBox role="button" tabIndex={0} onClick={onBack}>
        {/* TODO: Enable this when we allow other pools */}
        {/* <ArrowLeftOutlined style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.85)' }} />
        <StepTitle level={4}>{step}</StepTitle>
        <SecondaryText>{`/${total} ${title}`}</SecondaryText> */}
      </NavigationBox>
      {cta}
    </Container>
  );
}

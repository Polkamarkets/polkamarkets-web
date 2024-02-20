import type { ButtonProps } from '../Button';

interface ApproveTokenProps
  extends Pick<ButtonProps, 'fullwidth' | 'children'> {}

function ApproveToken({ children }: ApproveTokenProps) {
  return <>{children}</>;
}

export default ApproveToken;

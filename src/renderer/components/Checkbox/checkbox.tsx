import { FC } from 'react';
import './checkbox.scss';

export type CheckboxProps = {
  checked?: boolean;
  ariaLabel?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};
const Checkbox: FC<CheckboxProps> = ({
  ariaLabel = 'Checkbox',
  checked = false,
  onClick,
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={`checkbox ${checked ? 'on' : 'off'}`}
      onClick={onClick}
      type="button"
    />
  );
};

export default Checkbox;

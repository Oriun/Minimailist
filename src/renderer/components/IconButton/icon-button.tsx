import { FC } from 'react';
import './icon-button.scss';

export type IconButtonProps = {
  onClick: () => void;
  arialabel?: string;
  icon: React.ReactNode;
};

const IconButton: FC<IconButtonProps> = ({
  onClick,
  arialabel = 'icon button',
  icon,
}) => {
  return (
    <button
      className="icon-button"
      type="button"
      aria-label={arialabel}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default IconButton;

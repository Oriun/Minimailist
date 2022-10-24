/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, useRef, useState, useEffect } from 'react';
import './action-button.scss';
import { ReactComponent as Menu } from '../../../../../assets/icones/grip-vertical.svg';
import { ReactComponent as History } from '../../../../../assets/icones/history.svg';
import { ReactComponent as Hashtag } from '../../../../../assets/icones/hashtag.svg';
import { ReactComponent as EyeSlash } from '../../../../../assets/icones/eye-slash.svg';
import { ReactComponent as Trash } from '../../../../../assets/icones/trash-alt.svg';

import IconButton from '../../IconButton';

export type ActionButtonProps = {
  tags: { color: string; text: string }[];
  id: string;
  deleteElement: () => void;
  hideElement: () => void;
};

export enum ActionButtonModes {
  TAG = 'tag-mode',
  ACTIONS = 'actions-mode',
}

const ActionButton: FC<ActionButtonProps> = ({
  tags,
  id,
  deleteElement,
  hideElement,
}) => {
  const [mode, setMode] = useState<ActionButtonModes>(ActionButtonModes.TAG);
  const lastChange = useRef<number>(0);
  const resetMode = () => {
    if (mode === ActionButtonModes.TAG) return;
    setMode(ActionButtonModes.TAG);
  };
  const toggleMode = () => {
    if (mode === ActionButtonModes.TAG) {
      setMode(ActionButtonModes.ACTIONS);
    } else {
      setMode(ActionButtonModes.TAG);
    }
  };
  const toggleModeDebounce = () => {
    if (Date.now() - lastChange.current >= 600) toggleMode();
    lastChange.current = Date.now();
  };
  const tagList = useRef<HTMLDivElement>(null);
  const actionList = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    lastChange.current = Date.now();
    const ref = mode === ActionButtonModes.TAG ? tagList : actionList;
    if (!ref.current) return;
    setWidth(ref.current.getBoundingClientRect().width);
  }, [mode]);

  return (
    <div
      className="action-button"
      onMouseLeave={resetMode}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Menu
        className="menu-icon"
        onClick={toggleMode}
        onMouseEnter={toggleModeDebounce}
      />
      <div className={`action-button-container ${mode}`} style={{ width }}>
        <div className="tag-list" ref={tagList}>
          {tags.map((tag) => {
            return (
              <span className="tag" style={{ color: tag.color }} key={tag.text}>
                #{tag.text}
              </span>
            );
          })}
        </div>
        <div className="action-list" ref={actionList}>
          <IconButton
            arialabel="Me rappeler plus tard"
            onClick={console.log}
            icon={<History style={{ color: 'var(--cornflower-blue)' }} />}
          />
          <IconButton
            arialabel="Gérer les tags"
            onClick={console.log}
            icon={<Hashtag style={{ color: 'var(--violet-red)' }} />}
          />
          <IconButton
            arialabel="Masquer ce mail"
            onClick={hideElement}
            icon={<EyeSlash style={{ color: 'var(--ultramarine)' }} />}
          />
          <IconButton
            arialabel="Supprimer ce mail"
            onClick={deleteElement}
            icon={<Trash style={{ color: 'var(--purple)' }} />}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionButton;

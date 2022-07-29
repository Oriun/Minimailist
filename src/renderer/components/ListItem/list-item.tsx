import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import Checkbox from '../Checkbox';
import ActionButton from './ActionButton';
import './list-item.scss';

export type ListItemProps = {
  id: string;
  date: string;
  object: string;
  time: string;
  from: string;
  tags: { color: string; text: string }[];
  selected: boolean;
  toggleSelected: () => void;
  deleteElement: () => void;
  hideElement: () => void;
};

const ListItem: ForwardRefRenderFunction<HTMLDivElement, ListItemProps> = (
  {
    id,
    date,
    object,
    from,
    time,
    tags,
    selected = false,
    toggleSelected,
    deleteElement,
    hideElement,
  },
  ref
) => {
  const [isSelected, setIsSelected] = useState(selected);
  const actionRef = useRef<HTMLDivElement>(null);
  const size = useRef(0);
  useEffect(() => {
    if (!actionRef.current || selected || actionRef.current.matches(':hover'))
      return;
    size.current = actionRef.current.getBoundingClientRect().width;
  });
  useEffect(() => {
    if (selected === true) setIsSelected(true);
    else
      setTimeout(() => {
        setIsSelected(false);
      }, 400);
  }, [selected]);

  let width;
  if (selected) width = isSelected ? 350 : size.current;
  else if (isSelected) width = size.current;

  const toogleFromSelection = () => {
    toggleSelected();
  };
  return (
    <div
      className={`mailist-item ${selected ? 'selected' : ''}`}
      ref={ref}
      tabIndex={0}
      // onClick={toogleFromSelection}
      // onKeyDown={toogleFromSelection}
      aria-label={`Mail de ${from} le ${date} à ${time}. Objet: ${object}`}
      role="button"
    >
      <Checkbox
        onClick={toogleFromSelection}
        checked={selected}
        ariaLabel="sélectionner ce mail"
      />
      <div className="date">{date}</div>
      <div className="main">
        <div className="object">{object}</div>
        <div className="details">
          {time} - {from}
        </div>
      </div>
      <div className="id">@{id}</div>
      <div
        className="action-button-container"
        ref={actionRef}
        style={{
          width,
        }}
      >
        <ActionButton
          tags={tags}
          id={id}
          deleteElement={deleteElement}
          hideElement={hideElement}
        />
      </div>
    </div>
  );
};

export default forwardRef(ListItem);

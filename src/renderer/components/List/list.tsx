import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSet from '../../hooks/useSet';
import ListItem from '../ListItem';
import './list.scss';
import mails from '../../services/fake';
import useRefArray from '../../hooks/useRefArray';
import { MailByPeriod, PERIODS } from '../../types';
import { getMails } from '../../services/mails';

const List = () => {
  const [data, setData] = useState<Partial<MailByPeriod>>({});
  const refs = useRefArray<HTMLDivElement>();
  const { has, toggle } = useSet<string>();
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const toogleSelection = (id: string) => {
    return () => {
      toggle(id);
    };
  };
  const removeElement = (
    section: PERIODS,
    sectionIndex: number,
    index: number,
    keyframes: Keyframe[],
    duration = 400
  ) => {
    return () => {
      // eslint-disable-next-line consistent-return
      return new Promise<void>((resolve, reject) => {
        const element = refs.current[index];
        if (!element) return reject();
        element
          .animate(keyframes, {
            duration,
            fill: 'forwards',
            easing: 'ease-in-out',
          })
          .addEventListener('finish', () => {
            resolve();
            setData((d) => {
              const newData = { ...d };
              newData[section]!.splice(sectionIndex, 1);
              return newData;
            });
            refs.current.length -= 1;
          });
      });
    };
  };
  const hideElement = (
    section: PERIODS,
    sectionIndex: number,
    index: number
  ) => {
    const remove = removeElement(
      section,
      sectionIndex,
      index,
      [
        {
          opacity: 1,
          filter: 'grayscale(0)',
          backgroundColor: 'white',
        },
        {
          opacity: 1,
          offset: 0.15,
          filter: 'grayscale(1)',
          backgroundColor: 'var(--gray)',
        },
        {
          opacity: 0,
          offset: 0.85,
          height: '64px',
          marginTop: '0px',
          filter: 'grayscale(1)',
        },
        {
          opacity: 0,
          height: '0px',
          marginTop: '-14px',
          filter: 'grayscale(1)',
          backgroundColor: 'var(--gray)',
        },
      ],
      900
    );
    return () => {
      remove()
        .then(() => {
          // Add "hidden" tag to mail
          throw new Error('Not implemented');
        })
        .catch(console.error);
    };
  };
  const deleteElement = (
    section: PERIODS,
    sectionIndex: number,
    index: number
  ) => {
    const remove = removeElement(section, sectionIndex, index, [
      {
        opacity: 1,
        height: '64px',
        marginTop: '0px',
      },
      {
        opacity: 0,
        offset: 0.5,
        height: '64px',
        marginTop: '0px',
      },
      {
        opacity: 0,
        height: '0px',
        marginTop: '-14px',
      },
    ]);
    return () => {
      remove()
        .then(() => {
          // Delete permanently
          throw new Error('Not implemented');
        })
        .catch(console.error);
    };
  };
  let index = 0;
  useEffect(() => {
    console.log('getting mails');
    getMails()
      .then(setData)
      .catch((err) => {
        alert(err.message);
      });
  }, []);
  useEffect(() => {
    container.current?.animate(
      [
        {
          opacity: 0,
          offset: 0.5,
          transform: 'translateY(100px)',
        },
        {
          opacity: 1,
          transform: 'translateY(0px)',
        },
      ],
      {
        duration: 1_500,
        fill: 'forwards',
        easing: 'ease-in-out',
      }
    );
  }, []);
  const pageTransition = (id: string) => {
    return () => {
      container.current
        ?.animate(
          [
            {
              opacity: 1,
              transform: 'translateY(0px)',
            },
            {
              opacity: 0,
              offset: 0.75,
              transform: 'translateY(-100px)',
            },
            {
              opacity: 0,
              transform: 'translateY(-100px)',
            },
          ],
          {
            duration: 1_000,
            fill: 'forwards',
            easing: 'ease-in-out',
          }
        )
        .addEventListener('finish', () => {
          navigate(`/mail/${id}`);
        });
    };
  };
  return (
    <div className="mailist" ref={container}>
      {Object.keys(data).map((section) => {
        return (
          <Fragment key={section}>
            <h6 className="mailist-section">{section}</h6>
            {data[section as keyof typeof data]!.map((mail, sectionIndex) => {
              const params = [
                section as keyof typeof data,
                sectionIndex,
                index,
              ] as [keyof typeof data, number, number];
              return (
                <ListItem
                  {...mail}
                  selected={has(mail.id)}
                  toggleSelected={toogleSelection(mail.id)}
                  ref={refs(index++)}
                  hideElement={hideElement(...params)}
                  deleteElement={deleteElement(...params)}
                  key={mail.id}
                  openMail={pageTransition(mail.id)}
                />
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
};

export default List;

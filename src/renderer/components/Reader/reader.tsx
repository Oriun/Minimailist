/* eslint-disable react/no-danger */
import React from 'react';
import { getMail } from 'renderer/services/mails';
import { Mail } from 'renderer/types';
import './reader.scss';

type ReaderProps = {
  id: string;
};

const Reader: React.FC<ReaderProps> = ({ id }) => {
  const [mail, setMail] = React.useState<Mail | undefined>();
  React.useEffect(() => {
    getMail(id)
      .then(setMail)
      .catch((err) => {
        console.error(mail);
        setMail(undefined);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className="mailreader">
      Reader {mail?.id}
      <div
        dangerouslySetInnerHTML={{
          __html: `<document>${mail?.body ?? ''}</document>`,
        }}
      />
    </div>
  );
};

export default Reader;

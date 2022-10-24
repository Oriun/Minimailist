import React from 'react';
import { useParams } from 'react-router-dom';
import Header from 'renderer/components/Header';
import Reader from 'renderer/components/Reader';
import MainLayout from 'renderer/layouts/MainLayout';

const Mail = () => {
  const params = useParams();
  const { id } = params;
  return (
    <MainLayout
      Head={<Header />}
      Footer={<h1>Footer</h1>}
      Content={<Reader id={id ?? 'NONE'} />}
    />
  );
};

export default Mail;

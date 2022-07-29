import Header from 'renderer/components/Header';
import List from 'renderer/components/List';
import MainLayout from 'renderer/layouts/MainLayout';
import './main.scss';

const Main = () => {
  return (
    <MainLayout Head={<Header />} Content={<List />} Footer={<h1>Footer</h1>} />
  );
};

export default Main;

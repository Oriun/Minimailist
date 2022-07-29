import { FC } from 'react';
import './main-layout.scss';

type MainLayoutProps = {
  Head: React.ReactNode;
  Content: React.ReactNode;
  Footer: React.ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ Head, Content, Footer }) => {
  return (
    <div className="LAYOUT_main">
      <div className="LAYOUT_main_header">{Head}</div>
      <div className="LAYOUT_main_content noscrollbar">{Content}</div>
      <div className="LAYOUT_main_footer">{Footer}</div>
    </div>
  );
};

export default MainLayout;

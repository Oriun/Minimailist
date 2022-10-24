import './header.scss';
import { ReactComponent as ThumbUp } from '../../../../assets/icones/thumbs-up.svg';

const Header = () => {
  const nbOfMailsThatShouldBeDeleted = 58;
  const gramsOfCO2ToSave = nbOfMailsThatShouldBeDeleted * 8.97;
  const pluralMark = nbOfMailsThatShouldBeDeleted > 1 ? 's' : '';

  return (
    <div className="list-header">
      <h6>429 résultats</h6>
      <p>
        <ThumbUp />
        <span>
          Il y a {nbOfMailsThatShouldBeDeleted} mail{pluralMark} que vous
          pourriez effacer. Il produise {gramsOfCO2ToSave} grammes de CO2 chaque
          jours. Sauvez la planète en réduisant votre empreinte carbone...
        </span>
      </p>
    </div>
  );
};

export default Header;

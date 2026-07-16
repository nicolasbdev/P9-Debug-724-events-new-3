import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // 1. On clone le tableau avec [...] avant de trier pour éviter de muter les données d'origine
  const byDateDesc = data?.focus 
    ? [...data.focus].sort((evtA, evtB) => (new Date(evtA.date) < new Date(evtB.date) ? -1 : 1))
    : [];

  // 2. Gestion propre du défilement automatique avec useEffect et un nettoyage
  useEffect(() => {
    if (byDateDesc.length === 0) return () => {};

    const timer = setTimeout(() => {
      // Si on est sur la dernière carte, on repasse à 0, sinon on fait +1
      setIndex((currentIndex) => (currentIndex < byDateDesc.length - 1 ? currentIndex + 1 : 0));
    }, 5000);

    // Fonction de nettoyage pour tuer le timer si le composant s'arrête ou si l'index change
    return () => clearTimeout(timer);
  }, [index, byDateDesc.length]); // Dépendances requises

  if (!byDateDesc.length) return null;

  return (
    <div className="SlideCardList">
      {/* Première boucle : Uniquement pour afficher les images (une par une) */}
      {byDateDesc.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      {/* La pagination est sortie de la boucle principale : elle ne s'affiche qu'une seule fois */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={`${event.id || radioIdx}`} // Utilisation d'une clé unique fiable
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly // Évite les warnings de React sur les inputs contrôlés sans onChange
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
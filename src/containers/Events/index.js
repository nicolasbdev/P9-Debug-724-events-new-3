import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. D'abord, on filtre TOUS les événements qui correspondent à la catégorie choisie
  const eventsFilteredByType = (data?.events || []).filter((event) => {
    if (!type) return true; // Si pas de type, on garde tout
    return event.type === type; // Sinon, on ne garde que le type sélectionné
  });

  // 2. Ensuite, parmi ces événements filtrés, on ne garde que ceux de la page en cours
  const filteredEvents = eventsFilteredByType.filter((_, index) => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = currentPage * PER_PAGE;
    return index >= startIndex && index < endIndex;
  });

  const changeType = (evtType) => {
    setCurrentPage(1); // On reset à la page 1 quand on change de catégorie
    setType(evtType);
  };

  // 3. On calcule le nombre de pages sur le total filtré par type (Math.ceil est plus précis que Math.floor + 1)
  const pageNumber = Math.ceil((eventsFilteredByType.length || 0) / PER_PAGE);
  
  // Récupération des catégories uniques pour le Select
  const typeList = new Set(data?.events?.map((event) => event.type) || []);

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a 
                key={n} 
                href="#events" 
                className={currentPage === n + 1 ? "active" : ""} // Optionnel: pour styliser la page active
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
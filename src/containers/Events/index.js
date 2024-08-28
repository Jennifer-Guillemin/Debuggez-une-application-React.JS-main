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
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const sortedEvents = (data?.events || []).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Filtrez les événements en fonction du type
  const filteredEvents = sortedEvents
    .filter((event) => !type || event.type === type)
    .filter(
      (_, index) =>
        (currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index
    );

  // Fonction pour changer le type de filtre et réinitialiser la page
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Calculez le nombre total de pages nécessaires pour la pagination
  const pageNumber = Math.ceil(
    (sortedEvents.filter((event) => !type || event.type === type).length || 0) /
      PER_PAGE
  );

  // Créez une liste unique de types d'événements
  const typeList = new Set(data?.events.map((event) => event.type));

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
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
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

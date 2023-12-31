import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import NewVoyage from "./new-voyage";
import UpdateVoyage from "./update-voyage";
import Filters from "@/components/filteration";

const VoyageData = ({
  voyages,
  onVoyageCreated,
  onUpdateVoyage,
  currentVoyageId,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [filteredVoyages, setFilteredVoyages] = useState(voyages);

  const filterVoyages = useCallback(
    (filterValue) => {
      if (filterValue === "") {
        setFilteredVoyages(voyages);
      } else {
        const filtered = voyages.filter((voyage) => {
          const lowerCaseFilterValue = filterValue.toLowerCase();
          return (
            voyage.eta.toLowerCase().includes(lowerCaseFilterValue) ||
            voyage.arrivalTime.toLowerCase().includes(lowerCaseFilterValue) ||
            voyage.etd.toLowerCase().includes(lowerCaseFilterValue) ||
            voyage.departureTime.toLowerCase().includes(lowerCaseFilterValue)
          );
        });

        setFilteredVoyages(filtered);
      }
    },
    [voyages]
  );

  useEffect(() => {
    filterVoyages(filterValue);
  }, [filterValue, voyages, filterVoyages]);

  const handleVoyageCreated = (newVoyage) => {
    onVoyageCreated(newVoyage);
    setFilterValue("");
    // setFilteredVoyages((prevVoyages) => [newVoyage, ...prevVoyages]);
  };

  const handleUpdateVoyage = (updatedVoyage) => {
    onUpdateVoyage(updatedVoyage);
    setFilteredVoyages((prevVoyages) =>
      prevVoyages.map((voyage) =>
        voyage.id === updatedVoyage.id ? updatedVoyage : voyage
      )
    );
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };


  const isVesselOpened = !!filteredVoyages.filter(voyage => voyage.departureTime === '').length


  return (
    <div className="border-black/5 transition rounded-xl overflow-hidden">
        <div className="px-4 md:px-16 flex flex-col md:flex-row mt-8 justify-start items-center ">
      <div className="flex-1 mb-4">
        <NewVoyage voyages={voyages} disable={isVesselOpened} onVoyageCreated={handleVoyageCreated} />

        </div>
        <div className="mb-4">
        <Filters onFilterChange={handleFilterChange} />

        </div>
      </div>

      <div className="px-4 md:px-8 mt-4 mb-4 lg:px-16 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVoyages.map((voyage) => (
          <Card
            key={voyage.id}
            className="p-4 border-black/5 flex flex-col shadow-md hover:shadow-2xl transition rounded-2xl"
          >
            <div className="flex items-center justify-end mb-4">
              <div className="w-full">
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">
                    Estimated time arrival:
                  </div>
                  <div className="text-right">
                    {voyage.eta || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">Arrival Time:</div>
                  <div className="text-right">
                    {voyage.arrivalTime || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">
                    Estimated time departure:
                  </div>
                  <div className="text-right">
                    {voyage.etd || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">Departure Time:</div>
                  <div className="text-right">
                    {voyage.departureTime || ".................."}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-between content-end">
              <UpdateVoyage
                voyage={voyage}
                onUpdateVoyage={handleUpdateVoyage}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VoyageData;

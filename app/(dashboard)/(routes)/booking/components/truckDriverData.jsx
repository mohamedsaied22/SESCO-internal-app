import React, {useState, useEffect, useCallback} from "react";
import {Card} from "@/components/ui/card";
import NewTruck from "./new-truckDriver";
import UpdateTruck from "./update-truckDriver";
import Filters from "@/components/filteration";
import ReleaseTruck from "./release-truck";
import SortOptions from "./trucks-sorting";
import useSWR from "swr";
import {POSTAPI, PUTAPI} from "/utities/test";
import QrCodeModal from "@/app/(dashboard)/(routes)/booking/components/QRCodeModal";
import {toast} from "react-toastify";
import Link from "next/link";

const TruckDriverData = ({
                             selectedBooking,
                             trucks,
                             onTruckCreated,
                             onUpdateTruck,
                             currentBookingId,
                         }) => {
    const [filterValue, setFilterValue] = useState("");
    const [booking, setBooking] = useState(selectedBooking);

    const [filteredTruckDrivers, setFilteredTruckDrivers] = useState(booking.truckDriverList);
    const [releasedTrucks, setReleasedTrucks] = useState([]);
    const [sortOption, setSortOption] = useState("");


    const filterBookings = useCallback(
        (filterValue) => {
            if (filterValue === "") {
                setFilteredTruckDrivers(booking.truckDriverList);
            } else {
                const filtered = filteredTruckDrivers.filter((truckDriver) => {
                    const lowerCaseFilterValue = filterValue.toLowerCase();
                    return (
                        truckDriver.contractor.name.toLowerCase().includes(lowerCaseFilterValue) ||
                        //truckDriver.truckType.toLowerCase().includes(lowerCaseFilterValue) ||
                        truckDriver.truck.number.toLowerCase().includes(lowerCaseFilterValue) ||
                        truckDriver.driver.name.toLowerCase().includes(lowerCaseFilterValue)
                    );
                });

                setFilteredTruckDrivers(filtered);
            }
        },
        [trucks]
    );

    useEffect(() => {
        filterBookings(filterValue);
    }, [filterValue, trucks, filterBookings]);

    const handleTruckCreated = (newTruckDriver) => {
        handleAPIAddTruckDriver(newTruckDriver);

        //onTruckCreated(newTruck);
        //setFilterValue("");
        //setFilteredBookings((prevBookings) => [newTruck, ...prevBookings]);
    };

    const handleAPIAddTruckDriver = async (truckDriver) => {
        try {
            const result = await POSTAPI(
                "/api/booking/" + selectedBooking.bookingNumber + "/truckDriver",
                truckDriver
            );
            console.log(result);

            if (
                result.statusCode === 400 &&
                result.message.includes("bookingNumber")
            ) {
                console.error(result.message);
                // Handle validation error
                // toast
            } else if (result.statusCode === 400) {

                // console.
                console.error(result.message);
            } else {
                setBooking(result);
                onTruckCreated(result)
                setFilteredTruckDrivers(result.truckDriverList)
                //toast
                toast.success("Truck Driver added successfully!", {
                    position: toast.POSITION.TOP_RIGHT,
                    style: {
                        background: "#8acaff", // Background color
                        color: "#ffffff", // Text color
                        boxShadow:
                            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                        borderRadius: "12px 0  12px 0",
                        width: "96%",
                        fontSize: "bold",
                    },
                });
            }
        } catch (error) {
            console.error("Error adding contractor:", error);
            // Handle error
        }
    };

    const handleUpdateTruck = (updatedTruck) => {
        onUpdateTruck(updatedTruck);
        setFilteredTruckDrivers((prevBookings) =>
            prevBookings.map((truck) =>
                truck.id === updatedTruck.id ? updatedTruck : truck
            )
        );
    };

    // const handleUpdateTruck = (updatedTruck) => {
    //   // Check if the updated truck driver exists in the filteredBookings state
    //   const isDriverExisting = filteredBookings.some(
    //     (driver) => driver.id === updatedTruck.id
    //   );

    //   if (isDriverExisting) {
    //     // Update the state to reflect the changes in the specific truck driver
    //     setFilteredBookings((prevBookings) =>
    //       prevBookings.map((driver) =>
    //         driver.id === updatedTruck.id ? updatedTruck : driver
    //       )
    //     );

    //     // Handle local storage update for the specific truck driver
    //     const trucks = JSON.parse(localStorage.getItem("Trucks")) || [];
    //     const updatedDrivers = trucks.map((driver) =>
    //       driver.id === updatedTruck.id ? updatedTruck : driver
    //     );
    //     localStorage.setItem("Trucks", JSON.stringify(updatedDrivers));
    //   }
    // };

    const handleSortChanges = (sortValue) => {
        setSortOption(sortValue);

        switch (sortValue) {
            case "all":
                setFilteredTruckDrivers(booking.truckDriverList);
                break;
            case "released":
                setFilteredTruckDrivers(
                    booking.truckDriverList.filter((truck) => truck.truckDriverStatus === "RELEASED")
                );
                break;
            case "working":
                setFilteredTruckDrivers(
                    booking.truckDriverList.filter((truck) => truck.truckDriverStatus === "WORKING")
                );
                break;

        }
    };

    // Function to handle sort change
    const handleSortChange = (sortValue) => {
        setSortOption(sortValue);
        sortBookings(sortValue);
    };

    const handleFilterChange = (value) => {
        setFilterValue(value);
    };

    const handleTruckRelease = (booking) => {
        /*setReleasedTrucks((prevReleasedTrucks) => [
            ...prevReleasedTrucks,
            releasedTruck,
        ]);

        const updatedTruck = {...releasedTruck, status: "Released"};
        handleUpdateTruck(updatedTruck);*/
        console.log(booking)
        setBooking(booking)
        setFilteredTruckDrivers(booking.truckDriverList)


    };

    // const searchTruckContractors = (searchValue) => {
    //   setFilteredContractors(
    //     storedContractors.filter(
    //       (contractor) =>
    //         contractor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    //         contractor.code.toLowerCase().includes(searchValue.toLowerCase())
    //     )
    //   );
    // };

    return (
        <div className="border-black/5 transition rounded-xl">
            <div className="flex flex-col md:flex-row mt-8 mb-2 justify-center items-center px-4">
                <div className="flex-1 mb-4 ">
                    <NewTruck trucks={trucks} onTruckCreated={handleTruckCreated}/>

                </div>
                <div className="mb-4 ">
                    <SortOptions
                        sortOption={sortOption}
                        onSortChange={handleSortChanges}
                    />
                </div>
                <div className="mb-4 ">
                <Filters onFilterChange={handleFilterChange}/>

                </div>
            </div>

            <div className="px-4  mt-4 mb-4 lg:px-12 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-4">
                {filteredTruckDrivers.map((truckDriver, index) => (

                    <Card
                        key={index}
                        className="p-4 border-black/5 flex flex-col shadow-md hover:shadow-2xl transition rounded-2xl"
                    >
                        <Link href={`truckDriver/${truckDriver.id}/trips`}>
                            <div className="flex items-center justify-end mb-4">
                                <div className="w-full">
                                    {/* Display new truck driver details */}
                                    <div className="flex justify-between mb-2 shadow-md p-2">
                                        <div className="text-left text-sm">Contractor:</div>
                                        <div className="text-right">
                                            {truckDriver.contractor.name || ".................."}
                                        </div>
                                    </div>
                                    <div className="flex justify-between mb-2 shadow-md p-2">
                                        <div className="text-left text-sm">Driver Name:</div>
                                        <div className="text-right">
                                            {truckDriver.driver.name || ".................."}
                                        </div>
                                    </div>
                                    {/* <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">Truck Type:</div>
                  <div className="text-right">
                    {truck.truckType || ".................."}
                  </div>
                </div> */}
                                    <div className="flex justify-between mb-2 shadow-md p-2">
                                        <div className="text-left text-sm">Truck Code:</div>
                                        <div className="text-right">
                                            {truckDriver.truck.number || ".................."}
                                        </div>
                                    </div>
                                    {truckDriver.truckDriverStatus === "RELEASED" && (
                                        <div className="flex justify-center mb-2 shadow-md p-2">

                                            <div className="flex justify-center mb-2 text-sm font-semibold">
                                                {truckDriver.truckDriverStatusDetails[truckDriver.truckDriverStatusDetails.length - 1].releaseType && (
                                                    <span className="block">
                          Released: {truckDriver.truckDriverStatusDetails[truckDriver.truckDriverStatusDetails.length - 1].releaseType}
                        </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                        <div className="flex justify-center items-center ">
                            {/* Conditionally render the UpdateTruck component */}
                            {truckDriver.truckDriverStatus !== "RELEASED" && (
                                // Check if the status is not "Released"
                                <UpdateTruck
                                    truck={truckDriver.truck}
                                    onUpdateTruck={handleUpdateTruck}
                                />
                            )}

                            <ReleaseTruck
                                booking={selectedBooking}
                                truckDriver={truckDriver}
                                onTruckReleased={handleTruckRelease}
                                /* onUpdateTruck={handleUpdateTruck}*/
                            />
                            <QrCodeModal bookingNumber={selectedBooking.bookingNumber}
                                         truckDriverId={truckDriver.id}/>
                        </div>
                    </Card>

                ))}
            </div>
        </div>
    );
};

export default TruckDriverData;

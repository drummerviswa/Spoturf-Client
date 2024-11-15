import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import BookingCard from './BookingCard.tsx';
import makeRequest from '../../axios';
import { AuthContext, useAuth } from '../../context/AuthContext.tsx';

type Booking = {
  BID: number;
  name: string;
  mobileNo: string;
  sport: string;
  members: string;
  status: string;
  date: Date;
  slot: [];
};

export default function BookingDetails() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { currentUser } = useAuth(AuthContext);
  const date = window.location.pathname.split('/')[2]; // Retrieve date from URL
  const [changes, setChanges] = useState(false);

  // Re-fetch bookings when date or changes state changes
  console.log('TID:', currentUser.TID);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await makeRequest.get(
          `/bookings/bookings/date/${date}/TID/${currentUser.TID}`,
        );
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [date, changes]);

  const handleChanges = () => {
    setChanges((prev) => !prev); // Toggle changes to trigger re-fetch
  };

  console.log(bookings);

  return (
    <>
      <Breadcrumb db pageName={`Date: ${date}`} />
      {bookings.length > 0 ? (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
            New Bookings
          </h2>
          {bookings
            .filter((booking) => booking.status === 'Pending')
            .map((booking) => (
              <BookingCard
                key={booking.BID}
                BID={booking.BID}
                name={booking.name}
                members={booking.teamMembers}
                mobileNo={booking.mobileNo}
                sport={booking.game}
                status={booking.status}
                time={booking.slot}
                date={booking.date}
                setChanges={handleChanges} // Trigger state change
              />
            ))}

          <h2 className="text-xl font-semibold text-green-500">Booked</h2>
          {bookings
            .filter((booking) => booking.status === 'Confirmed')
            .map((booking) => (
              <BookingCard
                key={booking.BID}
                BID={booking.BID}
                name={booking.name}
                members={booking.teamMembers}
                mobileNo={booking.mobileNo}
                sport={booking.game}
                status={booking.status}
                time={booking.slot}
                date={booking.date}
                setChanges={handleChanges} // Trigger state change
              />
            ))}

          <h2 className="text-xl font-semibold text-red-600">Rejected</h2>
          {bookings
            .filter((booking) => booking.status === 'Cancelled')
            .map((booking) => (
              <BookingCard
                key={booking.BID}
                BID={booking.BID}
                name={booking.name}
                members={booking.teamMembers}
                mobileNo={booking.mobileNo}
                sport={booking.game}
                status={booking.status}
                time={booking.slot}
                date={booking.date}
                setChanges={handleChanges} // Trigger state change
              />
            ))}
        </div>
      ) : (
        <h1>No data found</h1>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';
import makeRequest from '../../axios';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

const Calendar = () => {
  const [dates, setDates] = useState<Array<null | number>>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const date = window.location.pathname.split('/')[2];

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await makeRequest.get(
          `/bookings/bookings/turf/${currentUser.TID}`,
        );
        console.log('Bookings response:', response.data); // Debugging response
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [date, currentUser.TID]);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthIndex = today.getMonth();
  const currentYearValue = today.getFullYear();

  useEffect(() => {
    generateDates(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateDates = (month: number, year: number) => {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const startDay = startOfMonth.getDay();

    const datesArray: Array<null | number> = [];
    for (let i = 0; i < startDay; i++) {
      datesArray.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      datesArray.push(day);
    }

    setDates(datesArray);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  const rows = [];
  for (let i = 0; i < dates.length; i += 7) {
    rows.push(dates.slice(i, i + 7));
  }

  // Updated function to ensure proper date comparison
  const getBookingCountForDate = (date: string, status: string) => {
    console.log('Checking bookings for date:', date, 'and status:', status); // Debugging
    const filteredBookings = bookings.filter((booking) => {
      const formattedBookingDate = moment(booking.date).format('DD-MM-YYYY');
      console.log('Booking date:', formattedBookingDate, 'Status:', booking.status); // Debugging
      return moment(booking.date).isSame(moment(date, 'DD-MM-YYYY'), 'day') && booking.status === status;
    });
    console.log(`Filtered bookings for ${status}:`, filteredBookings); // Debugging
    return filteredBookings.length;
  };

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className="px-2 bg-primary text-white rounded"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-2 bg-primary text-white rounded"
        >
          Next
        </button>
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="grid grid-cols-7">
                {row.map((date, index) => {
                  const formattedDate = date
                    ? `${date}-${currentMonth + 1}-${currentYear}`
                    : '';
                  const isToday =
                    date === currentDay &&
                    currentMonth === currentMonthIndex &&
                    currentYearValue === currentYear;

                  const pendingCount = getBookingCountForDate(formattedDate, 'Pending');
                  const confirmedCount = getBookingCountForDate(formattedDate, 'Confirmed');
                  const cancelledCount = getBookingCountForDate(formattedDate, 'Cancelled');

                  return (
                    <td
                      key={index}
                      className={`border border-stroke dark:border-strokedark h-20 md:h-25 xl:h-31 ${
                        isToday ? 'bg-primary' : ''
                      }`}
                    >
                      {date ? (
                        <Link
                          to={`/booking/${currentYear}-${
                            currentMonth + 1
                          }-${date}`}
                          className="flex items-center justify-center h-full w-full transition duration-500 hover:bg-gray dark:hover:bg-meta-4"
                        >
                          <span className="font-medium text-black dark:text-white">
                            {date}
                            <div>
                              <span className="text-xl px-2 font-semibold text-yellow-400">
                                {pendingCount}
                              </span>
                              <span className="text-xl px-2 font-semibold text-green-400">
                                {confirmedCount}
                              </span>
                              <span className="text-xl px-2 font-semibold text-red-400">
                                {cancelledCount}
                              </span>
                            </div>
                          </span>
                        </Link>
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Calendar;

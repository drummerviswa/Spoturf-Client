import { useContext, useEffect, useState } from 'react';
import makeRequest from '../axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

interface Booking {
  date: string;
  slot: [];
  game: [];
  teamMembers: number;
  court: string;
}

interface Customer {
  CID: number;
  name: string;
  mobileNo: string;
  area: string;
  profilePic: string;
  email: string;
  address: string;
  bookings: Booking[];
}

const Customers = () => {
  const { currentUser } = useContext(AuthContext);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await makeRequest.get(
          `/customers/turf/${currentUser.TID}`,
        );
        setCustomers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentUser.TID]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobileNo.includes(searchTerm),
  );

  return (
    <>
      <Breadcrumb pageName="Customers" />

      <form
        className="my-8"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Customers
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Customer"
          />
        </div>
      </form>

      <div className="flex flex-col gap-10">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {filteredCustomers.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs font-semibold uppercase bg-primary text-white">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Mobile Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Slot
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Game
                  </th>
                  <th scope="col" className="px-2 py-3 w-20">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Court
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, customerIndex) =>
                  customer.bookings.map((booking, bookingIndex) => (
                    <tr
                      key={`${customerIndex}-${bookingIndex}`}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {bookingIndex === 0 ? (
                        <>
                          <th
                            rowSpan={customer.bookings.length}
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white align-top"
                          >
                            {customer.CID}
                          </th>
                          <th
                            rowSpan={customer.bookings.length}
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white align-top"
                          >
                            {customer.name}
                          </th>
                          <td
                            rowSpan={customer.bookings.length}
                            className="px-6 py-4 align-top"
                          >
                            {customer.mobileNo.replace('+91', '+91 ')}
                          </td>
                        </>
                      ) : null}
                      <td className="px-6 py-4 text-start">
                        {moment(booking.date).format('ll')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking?.slot?.map((i, index) => (
                          <li
                            key={index}
                            className="list-none text-start p-0.5"
                          >
                            {i}
                          </li>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        {booking?.game?.map((i, index) => (
                          <li
                            key={index}
                            className="list-none text-start p-0.5"
                          >
                            {i}
                          </li>
                        ))}
                      </td>
                      <td className="px-2 py-4 w-20">{booking.teamMembers}</td>
                      <td className="px-6 py-4">{booking.court}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          ) : (
            <h1>No data found</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Customers;

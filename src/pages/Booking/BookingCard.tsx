import { useState, useEffect } from 'react';
import makeRequest from '../../axios';
import moment from 'moment';

type BookingProps = {
  BID: number;
  time: [];
  name: string;
  mobileNo: string;
  sport: string;
  members: string;
  status: string;
  date: string;
  setChanges: () => void;  // Callback to trigger re-fetch
};

export default function BookingCard({
  setChanges,
  BID,
  time,
  name,
  mobileNo,
  sport,
  members,
  status,
  date,
}: BookingProps) {
  const handleAccept = async () => {
    try {
      await makeRequest.put(`/bookings/status/${BID}`, { status: 'Confirmed' });
      setChanges(); // Trigger re-fetch by calling the state toggle function
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleReject = async () => {
    try {
      await makeRequest.put(`/bookings/status/${BID}`, { status: 'Cancelled' });
      setChanges(); // Trigger re-fetch by calling the state toggle function
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  console.log(time);

  return (
    <div className="flex items-start justify-between rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {moment(date).format('ll')}
        </span>
        <span className="text-xs py-4 text-gray-500 dark:text-gray-400">
          {Array.isArray(time) ? (
            time.map((i, index) => (
              <li key={index} className="list-none">
                {i}
              </li>
            ))
          ) : (
            <span>No available time slots</span>
          )}
        </span>
      </div>
      <div className="ml-4 flex-1 space-y-2">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">
          Customer: <span className="font-medium">{name}</span>
        </h3>
        <p className="text-md text-gray-500 dark:text-gray-400">
          Mobile No: <span className="font-medium">{mobileNo}</span>
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400">
          Sport: <span className="font-medium">{sport}</span>
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400">
          No. of Members: <span className="font-medium">{members}</span>
        </p>
        {status === 'Pending' && (
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleAccept}
              type="button"
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              type="button"
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
            >
              <svg
                className="me-1.5 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L17.94 6M18 18L6.06 6"
                />
              </svg>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

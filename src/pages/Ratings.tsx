import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import makeRequest from '../axios';

type Review = {
  id: number;
  name: string;
  message: string;
  rating: number;
};

export default function Ratings() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const TID = 'exampleTID'; // Replace with actual Turf ID as needed

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await makeRequest.get(`/api/reviews/${TID}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [TID]);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter functionality
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRating(Number(e.target.value));
  };

  // Filter reviews based on search term and rating
  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRating === 0 || review.rating === filterRating)
  );

  // Function to delete a review
  const deleteReview = async (reviewId: number) => {
    try {
      await makeRequest.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Reviews" />
      <section className="bg-white rounded-xl py-8 antialiased dark:bg-meta-4 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <form className="w-full">
                <div className="relative">
                  <input
                    type="search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Reviews"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </form>
              <div className="mt-6 sm:mt-0">
                <select
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  onChange={handleFilter}
                >
                  <option value={0}>All reviews</option>
                  <option value={5}>5 stars</option>
                  <option value={4}>4 stars</option>
                  <option value={3}>3 stars</option>
                  <option value={2}>2 stars</option>
                  <option value={1}>1 star</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flow-root sm:mt-8">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReviews.length>0?filteredReviews.map((review) => (
                  <div key={review.id} className="grid md:grid-cols-12 gap-4 md:gap-6 rounded-xl my-4 px-8 py-4 md:py-6 dark:bg-black bg-meta-2">
                    <dl className="md:col-span-3">
                      <dd className="text-base font-semibold text-gray-900 dark:text-white">
                        {review.name}
                      </dd>
                    </dl>
                    <dl className="md:col-span-6">
                      <dd className="text-gray-500 dark:text-gray-400">
                        {review.message}
                      </dd>
                    </dl>
                    <div className="md:col-span-3 flex items-center justify-between">
                      <dd className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"></path>
                          </svg>
                        ))}
                      </dd>
                      <button
                        type="button"
                        onClick={() => deleteReview(review.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <span className="sr-only">Delete</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeWidth="4" d="M6 12h.01m6 0h.01m5.99 0h.01"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )):<div>No reviews</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

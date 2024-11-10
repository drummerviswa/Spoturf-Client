import { useState, ChangeEvent, useEffect, useContext } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Slots from '../components/Slots';
import makeRequest from '../axios';
import { AuthContext } from '../context/AuthContext';
import defaultImage from '../images/default.png';

const Profile: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [client, setClient] = useState({
    turfName: '',
    area: '',
    address: '',
    price: '',
    maps: '',
    startTime: '',
    endTime: '',
    gamesAvailable: [],
    amenities: [],
    images: [], // Initialize with empty string for 3 images
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await makeRequest.get(`/turfs/${currentUser.TID}`);
        const complete = response.data;
        console.log(complete);
        console.log(response.data);

        setClient(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [currentUser.TID]);

  const handleImageChange = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await makeRequest.post('/upload', formData);
        const imageUrl = response.data.imageUrl;

        // Ensure prev.images is an array before using .map()
        setClient((prev) => {
          const updatedImages = [...prev.images]; // Make sure to create a copy of the array
          updatedImages[index] = imageUrl; // Update the image at the correct index
          return { ...prev, images: updatedImages }; // Set the new images state
        });
      } catch (error) {
        console.error('Image upload failed', error);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure that the arrays (gamesAvailable and amenities) are not being double-encoded or altered
      const response = await makeRequest.put(`/turfs/full/${currentUser.TID}`, {
        ...client,
        gamesAvailable: Array.isArray(client.gamesAvailable)
          ? client.gamesAvailable
          : JSON.parse(client.gamesAvailable),
        amenities: Array.isArray(client.amenities)
          ? client.amenities
          : JSON.parse(client.amenities),
        images: client.images,
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update failed: ', error);
    }
  };

  const handleGameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setClient((prev) => {
      const updatedGames = checked
        ? [...prev.gamesAvailable, value]
        : prev.gamesAvailable.filter((game) => game !== value);
      return { ...prev, gamesAvailable: updatedGames };
    });
  };

  const handleAmenityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setClient((prev) => {
      const updatedAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value);
      return { ...prev, amenities: updatedAmenities };
    });
  };

  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="relative z-20 h-35 md:h-65">
              <img
                src={
                  client?.images?.[index] && client.images[index] !== ''
                    ? client.images[index]
                    : defaultImage
                }
                alt={`Turf Image ${index + 1}`}
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
              <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                <label
                  htmlFor={`cover-${index}`}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
                >
                  <input
                    type="file"
                    id={`cover-${index}`}
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)} // Pass index to handle change
                  />
                  <span>Edit</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="turfName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Turf Name
                  </label>
                  <input
                    type="text"
                    id="turfName"
                    name="turfName"
                    value={client.turfName}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={client.address}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Price per Hour
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={client.price}
                    onChange={handleChange}
                    required
                    onWheel={(e) => e.target.blur()}
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="maps"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Maps Link
                  </label>
                  <input
                    type="url"
                    id="maps"
                    name="maps"
                    value={client.maps}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="startTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={client.startTime}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="endTime"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={client.endTime}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                  Games Available
                </h2>
                <div className="flex flex-wrap gap-4">
                  {['Football', 'Basketball', 'Cricket', 'Shuttle'].map(
                    (game) => (
                      <label key={game} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={game}
                          checked={client.gamesAvailable.includes(game)}
                          onChange={handleGameChange}
                        />
                        <span>{game}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-4">
                  {['Parking', 'Wifi', 'Changing Room', 'Shower', 'Toilet'].map(
                    (amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={client.amenities.includes(amenity)}
                          onChange={handleAmenityChange}
                        />
                        <span>{amenity}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <Slots />
              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/70"
              >
                Save Profile
              </button>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default Profile;

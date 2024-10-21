import React, { useState } from "react";
import { Calendar, Clock, User, Video, MapPin } from "lucide-react";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: "2024-10-20",
      time: "10:00 AM",
      doctor: "Dr. Emily Johnson",
      type: "Video Consultation",
      status: "Upcoming",
    },
    {
      id: 2,
      date: "2024-10-25",
      time: "2:30 PM",
      doctor: "Dr. Michael Chen",
      type: "In-Person",
      status: "Upcoming",
    },
    {
      id: 3,
      date: "2024-10-15",
      time: "11:15 AM",
      doctor: "Dr. Sarah Williams",
      type: "Video Consultation",
      status: "Completed",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const cancelAppointment = (id) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id),
    );
  };

  const addAppointment = (newAppointment) => {
    setAppointments([
      ...appointments,
      { ...newAppointment, id: Date.now(), status: "Upcoming" },
    ]);
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-light text-gray-900 mb-8 text-center">
        Your Appointments
      </h1>

      <div className="mb-8 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
        >
          Schedule New Appointment
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              onCancel={() => cancelAppointment(appointment.id)}
            />
          ))}
        </ul>
      </div>

      {showModal && (
        <ScheduleModal
          onClose={() => setShowModal(false)}
          onSubmit={addAppointment}
        />
      )}
    </div>
  );
};

const AppointmentItem = ({ appointment, onCancel }) => (
  <li className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-2">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm font-medium text-gray-900 truncate">
            {appointment.date} at {appointment.time}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-500 truncate">{appointment.doctor}</p>
        </div>
        <div className="flex items-center">
          {appointment.type === "Video Consultation" ? (
            <Video className="h-5 w-5 text-gray-400 mr-2" />
          ) : (
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          )}
          <p className="text-sm text-gray-500">{appointment.type}</p>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            appointment.status === "Upcoming"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {appointment.status}
        </span>
      </div>
      {appointment.status === "Upcoming" && (
        <button
          onClick={onCancel}
          className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
        >
          Cancel
        </button>
      )}
    </div>
  </li>
);

const ScheduleModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    doctor: "",
    type: "Video Consultation",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 mb-4"
                    id="modal-title"
                  >
                    Schedule New Appointment
                  </h3>
                  <div className="mt-2 space-y-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        id="time"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={formData.time}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="doctor"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Doctor
                      </label>
                      <input
                        type="text"
                        name="doctor"
                        id="doctor"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={formData.doctor}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Appointment Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="Video Consultation">
                          Video Consultation
                        </option>
                        <option value="In-Person">In-Person</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Schedule
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;

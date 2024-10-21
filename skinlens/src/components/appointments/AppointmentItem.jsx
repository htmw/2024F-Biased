import React from "react";
import { Calendar, User, Video, MapPin } from "lucide-react";

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
          onClick={() => onCancel(appointment.id)}
          className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
        >
          Cancel
        </button>
      )}
    </div>
  </li>
);

export default AppointmentItem;

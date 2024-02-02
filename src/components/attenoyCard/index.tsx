/* eslint-disable @next/next/no-img-element */

import {
  BookmarkIcon,
  TelephoneIcon,
  MailIcon,
  ProfileIcon,
  EyeIcon,
} from "@/components/icons";
import constants from "@/constants";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AttenoyCard({
  imageUrl,
  name,
  phoneNumber,
  location,
  email,
  website,
  description,
  cid,
  showClicks,
  clicks,
}: any) {
  const routeParams = useParams();

  const handleViewProfile = () => {
    fetch(
      `${constants.API_URL}/util/attorney/${routeParams.state}/${routeParams.city}/${cid}`,
      {
        method: `POST`,
      }
    );
    alert(`Profile viewed.`);
  };

  return (
    <div className="w-[100%] sm:w-[25rem] flex flex-col items-center border border-gray-500 rounded-2xl pb-4 mb-8 ">
      {showClicks && (
         <div className="w-full flex justify-start ml-4 mb-4">
            <div className="flex justify-center items-center px-2 mt-4 border rounded-md">
              <EyeIcon width={20} height={20} />
              <span className="pl-2">{clicks}</span>
            </div>
         </div>
      )}
      <div className="w-full flex justify-center flex-col items-center">
        <img
          className=" h-[10rem] aspect-[3/4] object-cover rounded-md"
          alt="profile"
          src={imageUrl || "/person.jpeg"}
        />
        <div className="flex text-gray-800 mt-4 justify-around">
          <BookmarkIcon width={16} height={16} />
          <span className="font-semibold text-xs ps-2">
            Top Rated Criminal defense lawyer
          </span>
        </div>
        <div className="mt-4 flex flex-col items-center w-full">
          <h3 className="font-bold text-xl px-8 text-blue-800 underline cursor-pointer text-center">
            {name || "Stephen Strange"}
          </h3>
          <Link
            className="text-sm px-8 text-blue-800 cursor-pointer text-center my-1"
            href={website || "https://www.google.com"}
          >
            {website || "https://www.google.com"}
          </Link>
          <button className="text-gray-400 flex w-[90%] items-center py-2  mt-2 border border-gray-700 rounded-full justify-center">
            <TelephoneIcon width={26} height={26} />
            <span className="font-semibold text-md">
              {phoneNumber || "123-123-1234"}
            </span>
          </button>
        </div>
      </div>
      <div className="mt-2 w-[90%] flex flex-col">
        <span className="font-bold text-gray-500 text-sm">
          {location || "New York, NY"}
        </span>
        <span className="font-semibold text-gray-800 text-sm mt-2">
          {description ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, asperiores."}
        </span>

        <div className="flex w-full justify-around mt-4">
          <a
            className="w-[40%] bg-purple-900 rounded-full text-white flex cursor-pointer justify-center items-center py-3"
            href={email ? `mailto:${email}` : "mailto:someone@example.com"}
          >
            <MailIcon height={20} width={20} />
            <span className="font-semibold text-sm ml-2">Contact me</span>
          </a>
          <button
            className="w-[40%] bg-purple-900 rounded-full text-white flex cursor-pointer justify-center items-center py-3"
            onClick={handleViewProfile}
          >
            <ProfileIcon height={20} width={20} />
            <span className="font-semibold text-sm ml-2">View Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

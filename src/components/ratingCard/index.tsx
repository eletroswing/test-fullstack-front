/* eslint-disable @next/next/no-img-element */

function Rating({ stars }: any) {
  const filledStars = Math.floor(stars);

  const starElements = [];

  for (let i = 0; i < filledStars; i++) {
    starElements.push(
      <svg
        key={i}
        className="w-4 h-4 text-yellow-300 me-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
  }
  for (let i = starElements.length; i < 5; i++) {
    starElements.push(
      <svg
        key={i}
        className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
  }
  return starElements;
}

export default function RatingCard({
  stars,
  created_at,
  user_created_at,
  username,
  content,
}: any) {
  return (
    <div className="w-[30rem] h-full  p-4 border border-gray-400 rounded-lg overflow-hidden mr-8">
      <div className="flex">
        <div className="flex items-center">
          <Rating stars={stars} />
          <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {stars || "4.95"}
          </p>
          <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            out of
          </p>
          <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            5
          </p>
        </div>
        <span className="font-semibold text-sm ml-3">
          {new Date(created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }) || "Today"}
        </span>
      </div>
      <div className="my-4 w-full h-fit overflow-hidden break-all">
        {content ||
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse, blanditiis tenetur consequatur ratione nostrum, perferendis numquam quidem maiores libero eum ipsum sed, temporibus quibusdam excepturi? Modi, nemo deleniti. Aperiam, officiis!"}
      </div>
      <div className="w-full flex">
        <div className="ml-3 flex flex-col">
          <span className="font-semibold text-sm">{username || "Daniel"}</span>
          <span className="font-semibold text-xs text-gray-600">
            User since{" "}
            {new Date(user_created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }) || "3/3/2020"}
            .
          </span>
        </div>
      </div>
    </div>
  );
}

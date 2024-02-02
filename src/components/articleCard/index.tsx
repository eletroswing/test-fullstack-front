/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import showdown from "showdown";

export default function ArticleCard({
  title,
  text,
  created,
  link,
  image,
}: any) {
  const converter = new showdown.Converter();

  return (
    <div className="p-4 border-b border-gray-400 mr-8 flex cursor-pointer mb-4">
      <Link
        href={link}
        className="flex justify-center overflow-y-hidden"
      >
        <div className="pl-5 h-full flex flex-col justify-center text-left">
          <span className="text-2xl font-semibold">
            {title || "How to get Bigger"}
          </span>
          <span className="text-xs font-semibold pl-2 pt-1">
            Published at {created || "08/19/20"}
          </span>
          <span
            className="text-xs text-gray-500 pt-4 w-full break-all h-[5rem] overflow-hidden"
            dangerouslySetInnerHTML={{
              __html:
                converter.makeHtml(text) ||
                "Lorem ipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsum dolor sit amet consectetur adipisicing elit. Molestiae totam tempora in dolorum sed numquam labore accusamus tempore laboriosam assumenda dolorem quos ipsa sint nemo, optio doloribus neque. Corrupti dolores ratione sapiente dolorum earum eum possimus natus distinctio voluptate repellendus nemo enim assumenda at nisi, quos modi ipsa quisquam pariatur.",
            }}
          ></span>
        </div>
      </Link>
    </div>
  );
}

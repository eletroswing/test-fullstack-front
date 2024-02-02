/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import constants from "@/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

function Table({ data }: any) {
  return (
    <>
      <section className="px-8 w-full flex justify-center">
        <div className="w-[90%] md:w-[50%] flex flex-col justify-center items-center">
          {data.states.map((state: any) => {
            return (
              <Link
                key={`${(state.state, state.state_id)}`}
                href={`/admin/${state.state_id}`}
                className="text-gray-700 hover:bg-gray-200 cursor-pointer w-full border text-center py-4 "
              >
                <div>
                  <span className="text-md text-center">{state.state},</span>
                  <span className="text-md text-center">
                    {state.state_id}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetch(
      `${constants.API_URL}/public?page=${page}`
    )
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [page]);

  return (
    <main className="w-full pb-20 px-6 overflow-x-hidden">
      <header className="w-full">
        <div className=" w-full flex justify-center flex-col items-center">
          <h1 className="font-bold text-2xl px-8 pt-10">Select your State.</h1>
        </div>
      </header>

      <nav aria-label="Breadcrumb" className="w-full mb-8 mt-4">
        <div className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 w-fit">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg
                  className="w-3 h-3 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </a>
            </li>
          </ol>
        </div>
      </nav>

      {!data ? (
        <div className="w-full flex justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Table data={data} />
          <section className="pt-4">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing page{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {data.total_pages}
                </span>{" "}
                Pages
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                {page > 1 ? (
                  <button
                    className="flex cursor-pointer items-center justify-center px-4 h-10 text-base font-medium text-gray-600 bg-gray-300 rounded-s hover:bg-gray-400 hover:text-gray-200 dark:bg-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-600"
                    onClick={() => {
                      setData(null);
                      setPage(page - 1);
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </button>
                ) : (
                  <a className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-600 bg-gray-300 rounded-s  dark:bg-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-600">
                    <svg
                      className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Prev
                  </a>
                )}

                {page < data.total_pages ? (
                  <button
                    onClick={() => {
                      setData(null);
                      setPage(page + 1);
                    }}
                    className="flex items-center cursor-pointer justify-center px-4 h-10 text-base font-medium text-gray-600 bg-gray-300 border-0 border-s border-gray-700 rounded-e hover:bg-gray-400 hover:text-gray-200 dark:bg-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-600"
                  >
                    Next
                    <svg
                      className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                ) : (
                  <a className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-600 bg-gray-300 border-0 border-s border-gray-700 rounded-e dark:bg-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-600">
                    Next
                    <svg
                      className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use server";

import ArticleCard from "@/components/articleCard";
import AttenoyCard from "@/components/attenoyCard";
import Collapsible from "@/components/collapsible";
import EmbeddedCard from "@/components/embeddedCard";
import RatingCard from "@/components/ratingCard";
import Link from "next/link";
import Script from "next/script";

import showdown from "showdown";
import constants from "@/constants";
import { notFound } from "next/navigation";

async function fetchData({ params }: any) {
  const res = await fetch(
    `${constants.API_URL}/public/${params.state}/${params.city}`,
    { next: { revalidate: 5 } }
  );

    if(res.status != 200) return notFound()

  var json = await res.json();

  const faqEntity = json.faq.map((faq: any) => {
    return {
      "@type": "Question",
      name: faq.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: `<p>${faq.content}</p>`,
      },
    };
  });

  const articleEntity = json.articles.map((article: any) => {
    return {
      headline: article.title,
      image: "https://queroassistir.com/white.png",
      datePublished: new Date(article.created_at).toISOString(),
      dateModified: new Date(article.created_at).toISOString(),
      author: {
        "@type": "Person",
        name: "Jason Portagrande",
      },
      url: `https://queroassistir.com/${params.state}/${params.city}/${article.slug}`,
    };
  });

  const reviewsEntity = {
    rating:
      json.reviews.reduce(
        (total: any, object: any) => total + object.stars,
        0
      ) / json.reviews.length,
    best: 5,
    worst: 1,
    count: json.reviews.length,
  };

  json.faqEntity = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...faqEntity],
  };

  json.articlesEntity = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    articles: [...articleEntity],
  };

  json.reviewsEntity = {
    "@context": "https://schema.org/",
    "@type": "EmployerAggregateRating",
    itemReviewed: {
      "@type": "Organization",
      name: "Atternoy Listing",
      sameAs: `https://queroassistir.com/${params.state}/${params.city}`,
    },
    ratingValue: reviewsEntity.rating,
    bestRating: reviewsEntity.best,
    worstRating: reviewsEntity.worst,
    ratingCount: reviewsEntity.count,
  };

  return json;
}

export default async function Page(props: any) {
  const data = await fetchData(props);
  const converter = new showdown.Converter();

  return (
    <>
      <Script src="https://www.tiktok.com/embed.js" id="tiktok" />

      {data.faq.length > 0 && (
        <Script
          id="structureFaq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.faqEntity),
          }}
        />
      )}

      {data.articles.length > 0 && (
        <Script
          id="structureArticle"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.articlesEntity),
          }}
        />
      )}

      {data.reviews.length > 0 && (
        <Script
          id="structureReviews"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.reviewsEntity),
          }}
        />
      )}

      {!data ? (
        <div className="w-full flex justify-center pt-20">
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
          {!data.header.title ? (
            <div className="text-center">
              <h1 className="mb-4 text-6xl font-semibold text-red-500">404</h1>
              <p className="mb-4 text-lg text-gray-600">
                Oops! Looks like you're lost.
              </p>
              <div className="animate-bounce">
                <svg
                  className="mx-auto h-16 w-16 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </div>
              <p className="mt-4 text-gray-600">
                Let's get you back{" "}
                <Link href="/public/" className="text-blue-500">
                  home
                </Link>
                .
              </p>
            </div>
          ) : (
            <main className="w-full pb-20 px-6 overflow-x-hidden">
              <header className="w-full relative">
                <img
                  className="w-full h-[10rem]"
                  alt="banner"
                  src={data.header.image || "/white.png"}
                />
                <div className="absolute top-[25%] w-full flex justify-center flex-col items-center">
                  <h1 className="font-bold text-2xl px-8">
                    {data.header.title}
                  </h1>
                </div>
              </header>

              <nav aria-label="Breadcrumb" className="w-full mb-8 mt-4">
                <div className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 w-fit">
                  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                      <Link
                        href={`/public/`}
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
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
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/public/${props.params.state}`}
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        <svg
                          className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                        {props.params.state || "Home"}
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg
                          className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                        <a className="cursor-pointer ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                          {props.params.city || "city"}
                        </a>
                      </div>
                    </li>
                  </ol>
                </div>
              </nav>

              <section className="w-full justify-center flex flex-col items-center">
                {data.attorney.map((attorney: any) => {
                  return (
                    <div key={JSON.stringify(attorney)}>
                      <AttenoyCard
                        showClicks={false}
                        clicks={attorney.clicks}
                        imageUrl={attorney.image}
                        name={attorney.name}
                        phoneNumber={attorney.phone}
                        location={attorney.address}
                        email={attorney.email}
                        website={attorney.website}
                        description={attorney.description}
                        cid={attorney.cid}
                      />
                    </div>
                  );
                })}
              </section>
              {data.reviews.length != 0 && (
                <span className="text-xl pt-10 underline">Ratings</span>
              )}
              <section className="overflow-x-auto mb-10">
                <div className="mt-2 flex w-fit mb-2">
                  {data.reviews.map((reviews: any) => {
                    return (
                      <div key={JSON.stringify(reviews)}>
                        <RatingCard
                          stars={reviews.stars}
                          created_at={new Date(
                            reviews.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                          user_created_at={new Date(
                            reviews.user_exists_from
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                          username={reviews.username}
                          content={reviews.content}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
              {data.faq.length != 0 && (
                <span className="text-xl pt-10 underline">FAQ</span>
              )}
              <section className="w-full mt-4">
                {data.faq.map((faq: any) => {
                  return (
                    <div
                      key={`${JSON.stringify(faq) + new Date().toISOString()}`}
                    >
                      <Collapsible title={faq.title} content={faq.content} />
                    </div>
                  );
                })}
              </section>
              {data.embedded_videos.length != 0 && (
                <span className="text-xl pt-10 underline">Embedded Videos</span>
              )}

              <section className="w-full pt-4 flex justify-center flex-col">
                {data.embedded_videos.map((embedded_video: any) => {
                  return (
                    <div
                      key={`${
                        JSON.stringify(embedded_video) +
                        new Date().toISOString()
                      }`}
                    >
                      <EmbeddedCard
                        provider={embedded_video.provider}
                        url={embedded_video.url}
                      />
                    </div>
                  );
                })}
              </section>
              {data.articles.length != 0 && (
                <span className="text-xl pt-10 underline">Articles</span>
              )}

              <section className="w-full text-center flex flex-col pt-4">
                {data.articles.map((article: any) => {
                  return (
                    <div
                      key={`${
                        JSON.stringify(article) + new Date().toISOString()
                      }`}
                    >
                      <ArticleCard
                        link={`/public/${props.params.state}/${props.params.city}/${article.slug}`}
                        title={article.title}
                        text={converter.makeHtml(article.text)}
                        created={new Date(
                          article.created_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                        image={article.image}
                      />
                    </div>
                  );
                })}
              </section>
              <span className="text-xl pt-10 underline">Zip Codes</span>
              <section className="w-full text-center flex flex-col pt-4">
                <span className="">
                  ZIP CODES FOR PERSONAL INJURY LAW FIRMS
                </span>
                <span className="">{data.zips}</span>
              </section>
            </main>
          )}
        </>
      )}
    </>
  );
}

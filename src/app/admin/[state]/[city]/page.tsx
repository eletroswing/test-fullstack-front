/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import ArticleCard from "@/components/articleCard";
import AttenoyCard from "@/components/attenoyCard";
import Collapsible from "@/components/collapsible";
import EmbeddedCard from "@/components/embeddedCard";
import RatingCard from "@/components/ratingCard";
import Link from "next/link";
import Script from "next/script";
import { v4 as uuidV4 } from "uuid";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import constants from "@/constants";

import showdown from "showdown";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();


  const [data, setData] = useState<any>(null);
  const [editMode, setEditMode] = useState<any>(false);

  const headerForm = useForm();
  const zipsForm = useForm();

  const attorneyForm = useForm();
  const attorneyFormArray = useFieldArray({
    control: attorneyForm.control,
    name: "attorney",
  });

  const articlesForm = useForm();
  const articlesFormArray = useFieldArray({
    control: articlesForm.control,
    name: "articles",
  });

  const rattingsForm = useForm();
  const rattingFormArray = useFieldArray({
    control: rattingsForm.control,
    name: "reviews",
  });

  const embeddedForm = useForm();
  const embededFormArray = useFieldArray({
    control: embeddedForm.control,
    name: "embedded",
  });

  const faqForm = useForm();
  const faqFormArray = useFieldArray({
    control: faqForm.control,
    name: "faq",
  });

  const routeParams = useParams();

  const converter = new showdown.Converter();

  useEffect(() => {
    fetch(
      `${constants.API_URL}/public/${routeParams.state}/${routeParams.city}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        headerForm.setValue("title", res.header.title);
        zipsForm.setValue("zips", res.zips);
        faqForm.setValue("faq", res.faq);
        embeddedForm.setValue("embedded", res.embedded_videos);
        rattingsForm.setValue("reviews", res.reviews);
        articlesForm.setValue("articles", res.articles);
        attorneyForm.setValue("attorney", res.attorney);
      });
  }, []);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (readerEvt: any) => {
            let arrayBuffer = readerEvt.target.result;
            let binaryString = "";
            let bytes = new Uint8Array(arrayBuffer);
            let length = bytes.byteLength;

            for (let i = 0; i < length; i++) {
                binaryString += String.fromCharCode(bytes[i]);
            }

            let base64String = btoa(binaryString);
            resolve(`data:${file.type};base64,${base64String}`); 
        };

        reader.onerror = (error) => {
            reject(error); 
        };

        
        reader.readAsArrayBuffer(file);
    });
}

  const onHeaderSubmit = (d: any) => {
    if (d.image.length != 0) {
      alertOk();
      getBase64(d.image[0]).then((image) => {
        getToken().then(token => fetch(
          `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/header`,
          {
            method: `PATCH`,
            headers: {
              "content-type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              image: image,
            }),
          }
        ));

        let modifiedData = data;
        modifiedData.header.image = image;

        setData(modifiedData);
      })
    }

    if (d.title != data.header.title) {
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/header`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            title: d.title,
          }),
        }
      ));

      let modifiedData = data;
      modifiedData.header.title = d.title;

      setData(modifiedData);
    }
  };

  const onZipsSubmit = (d: any) => {
    if (d.zips != data.zips) {
      alertOk();
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/zips`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            zips: d.zips,
          }),
        }
      ));

      let modifiedData = data;
      modifiedData.zips = d.zips;

      setData(modifiedData);
    }
  };

  const onFaqsSubmit = (d: any) => {
    if (JSON.stringify(d.faq) != JSON.stringify(data.faq)) {
      alertOk();
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/faqs`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            faqs: d.faq,
          }),
        }
      ));

      let modifiedData = data;
      modifiedData.faq = d.faq;

      setData(modifiedData);
    }
  };

  const onEmbeddedSubmit = (d: any) => {
    if (JSON.stringify(d.embedded) != JSON.stringify(data.embedded_videos)) {
      alertOk();
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/embedded`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(d),
        }
      ));

      let modifiedData = data;
      modifiedData.embedded_videos = d.embedded;

      setData(modifiedData);
    }
  };

  const onRattingSubmit = (t: any) => {
    let d = t;
    d.reviews.forEach((review: any) => {
      review.stars = parseInt(review.stars);
    });

    if (JSON.stringify(d.reviews) != JSON.stringify(data.reviews)) {
      alertOk();
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/reviews`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(d),
        }
      ));

      let modifiedData = data;
      modifiedData.reviews = d.reviews;

      setData(modifiedData);
    }
  };

  const onArticlesSubmit = (d: any) => {
    alertOk();
    if (JSON.stringify(d.articles) != JSON.stringify(data.articles)) {
      var r = d;
      r.articles = d.articles.map((article: any) => {
        if(article.slug) return article;
        return {
          ...article,
          slug: uuidV4()
        }
      })
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/article`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(r),
        }
      ));

      let modifiedData = data;
      modifiedData.articles = r.articles;

      setData(modifiedData);
    }
  };

  const onAttorneySubmit = (d: any) => {
    if (JSON.stringify(d.attorney) != JSON.stringify(data.attorney)) {
      alertOk();
      getToken().then(token => fetch(
        `${constants.API_URL}/private/${routeParams.state}/${routeParams.city}/attorney`,
        {
          method: `PATCH`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(d),
        }
      ));

      let modifiedData = data;
      modifiedData.attorney = d.attorney;

      setData(modifiedData);
    }
  };

  const alertOk = () => alert("saved");

  return (
    <>
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
                <Link href="/admin/" className="text-blue-500">
                  home
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-end">
                <button
                  className="m-4 p-2 border rounded-md text-white bg-red-500"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Viwer mode" : "Edit mode"}
                </button>
              </div>

              {editMode ? (
                <div className="w-full p-8">
                  <div className="border rounded-lg p-4">
                    <span>Header:</span>
                    <form onSubmit={headerForm.handleSubmit(onHeaderSubmit)}>
                      <input
                        type="text"
                        {...headerForm.register("title")}
                        required
                        id="title"
                        placeholder="Title"
                        className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <input
                        type="file"
                        {...headerForm.register("image", )}
                        accept="image/png, image/gif, image/jpeg"
                        className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Image" />
                     
                      <div className="w-full justify-end flex mt-2">
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="border rounded-lg p-4 mt-6">
                    <span>Zips:</span>
                    <form onSubmit={zipsForm.handleSubmit(onZipsSubmit)}>
                      <textarea
                        {...zipsForm.register("zips")}
                        required
                        id="zips"
                        placeholder="Zips"
                        className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />

                      <div className="w-full justify-end flex mt-2">
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="border rounded-lg p-4 mt-6">
                    <span>Embeddeds:</span>
                    <form
                      onSubmit={embeddedForm.handleSubmit(onEmbeddedSubmit)}
                    >
                      {embededFormArray.fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 m-4"
                        >
                          <div className="w-full flex justify-end">
                            <button
                              type="button"
                              onClick={() => embededFormArray.remove(index)}
                            >
                              X
                            </button>
                          </div>
                          <select
                            {...embeddedForm.register(
                              `embedded.${index}.provider`
                            )}
                            defaultValue="youtube"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="youtube">Youtube</option>
                            <option value="tiktok">TikTok</option>
                          </select>
                          <input
                            type="text"
                            {...embeddedForm.register(`embedded.${index}.url`)}
                            required
                            placeholder="Iframe code"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>
                      ))}
                      <div className="w-full justify-between flex mt-2">
                        <button
                          type="button"
                          className="bg-blue-500 rounded-lg py-2 px-4 text-white"
                          onClick={() =>
                            embededFormArray.append({
                              provider: "youtube",
                              url: "",
                            })
                          }
                        >
                          New
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="border rounded-lg p-4 mt-6">
                    <span>Rattings:</span>
                    <form onSubmit={rattingsForm.handleSubmit(onRattingSubmit)}>
                      {rattingFormArray.fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 m-4"
                        >
                          <div className="w-full flex justify-end">
                            <button
                              type="button"
                              onClick={() => rattingFormArray.remove(index)}
                            >
                              X
                            </button>
                          </div>
                          <input
                            type="text"
                            {...rattingsForm.register(
                              `reviews.${index}.username`
                            )}
                            required
                            placeholder="Username"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <textarea
                            {...rattingsForm.register(
                              `reviews.${index}.content`
                            )}
                            required
                            placeholder="Content"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="number"
                            min={0}
                            max={5}
                            {...rattingsForm.register(`reviews.${index}.stars`)}
                            required
                            placeholder="Stars"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="datetime-local"
                            {...rattingsForm.register(
                              `reviews.${index}.created_at`
                            )}
                            placeholder="Created At"
                            required
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="datetime-local"
                            {...rattingsForm.register(
                              `reviews.${index}.user_exists_from`
                            )}
                            placeholder="User Created At"
                            required
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>
                      ))}
                      <div className="w-full justify-between flex mt-2">
                        <button
                          type="button"
                          className="bg-blue-500 rounded-lg py-2 px-4 text-white"
                          onClick={() =>
                            rattingFormArray.append({
                              username: "",
                              content: "",
                              stars: "",
                              created_at: "",
                              user_exists_from: "",
                            })
                          }
                        >
                          New
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="border rounded-lg p-4 mt-6">
                    <span>Articles:</span>
                    <form
                      onSubmit={articlesForm.handleSubmit(onArticlesSubmit)}
                    >
                      {articlesFormArray.fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 m-4"
                        >
                          <div className="w-full flex justify-end">
                            <button
                              type="button"
                              onClick={() => articlesFormArray.remove(index)}
                            >
                              X
                            </button>
                          </div>
                          <input
                            type="text"
                            {...articlesForm.register(
                              `articles.${index}.title`
                            )}
                            required
                            placeholder="Title"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <textarea
                            {...articlesForm.register(`articles.${index}.text`)}
                            required
                            placeholder="Markdown"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="datetime-local"
                            {...articlesForm.register(
                              `articles.${index}.created_at`
                            )}
                            placeholder="Created At"
                            required
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>
                      ))}
                      <div className="w-full justify-between flex mt-2">
                        <button
                          type="button"
                          className="bg-blue-500 rounded-lg py-2 px-4 text-white"
                          onClick={() =>
                            articlesFormArray.append({
                              text: "",
                              title: "",
                              created_at: "",
                            })
                          }
                        >
                          New
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="border rounded-lg p-4 mt-6">
                    <span>Attorney:</span>
                    <form
                      onSubmit={attorneyForm.handleSubmit(onAttorneySubmit)}
                    >
                      {attorneyFormArray.fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 m-4"
                        >
                          <div className="w-full flex justify-end">
                            <button
                              type="button"
                              onClick={() => attorneyFormArray.remove(index)}
                            >
                              X
                            </button>
                          </div>
                          <input
                            type="text"
                            {...attorneyForm.register(`attorney.${index}.name`)}
                            required
                            placeholder="Name"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="text"
                            {...attorneyForm.register(
                              `attorney.${index}.cid`
                            )}
                            required
                            placeholder="Cid"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="email"
                            {...attorneyForm.register(
                              `attorney.${index}.email`
                            )}
                            required
                            placeholder="Email"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="text"
                            {...attorneyForm.register(
                              `attorney.${index}.address`
                            )}
                            required
                            placeholder="Address"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="text"
                            {...attorneyForm.register(
                              `attorney.${index}.phone`
                            )}
                            required
                            placeholder="Phone"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="url"
                            {...attorneyForm.register(
                              `attorney.${index}.website`
                            )}
                            required
                            placeholder="Website"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <textarea
                            {...attorneyForm.register(
                              `attorney.${index}.description`
                            )}
                            required
                            placeholder="Description"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>
                      ))}
                      <div className="w-full justify-between flex mt-2">
                        <button
                          type="button"
                          className="bg-blue-500 rounded-lg py-2 px-4 text-white"
                          onClick={() =>
                            attorneyFormArray.append({
                              cid: "",
                              name: "",
                              email: "",
                              address: "",
                              phone: "",
                              website: "",
                              description: "",
                            })
                          }
                        >
                          New
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="border rounded-lg p-4 mt-6">
                    <span>Faqs:</span>
                    <form onSubmit={faqForm.handleSubmit(onFaqsSubmit)}>
                      {faqFormArray.fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 m-4"
                        >
                          <div className="w-full flex justify-end">
                            <button
                              type="button"
                              onClick={() => faqFormArray.remove(index)}
                            >
                              X
                            </button>
                          </div>
                          <input
                            type="text"
                            {...faqForm.register(`faq.${index}.title`)}
                            required
                            placeholder="Title"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                          <input
                            type="text"
                            {...faqForm.register(`faq.${index}.content`)}
                            required
                            placeholder="Content"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        </div>
                      ))}
                      <div className="w-full justify-between flex mt-2">
                        <button
                          type="button"
                          className="bg-blue-500 rounded-lg py-2 px-4 text-white"
                          onClick={() =>
                            faqFormArray.append({ title: "", content: "" })
                          }
                        >
                          New
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 rounded-lg py-2 px-4 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <main className="w-full pb-20 px-6 overflow-x-hidden">
                  <Script src="https://www.tiktok.com/embed.js" />
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
                            href={`/admin/`}
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
                            href={`/admin/${routeParams.state}`}
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
                            {routeParams.state || "Home"}
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
                              {routeParams.city || "city"}
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
                            showClicks={true}
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
                  {data.reviews.length != 0 && <span className="text-xl pt-10 underline">Ratings</span>}
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
                  {data.faq.length != 0 && <span className="text-xl pt-10 underline">FAQ</span>}
                  <section className="w-full mt-4">
                    {data.faq.map((faq: any) => {
                      return (
                        <div
                          key={`${
                            JSON.stringify(faq) + new Date().toISOString()
                          }`}
                        >
                          <Collapsible
                            title={faq.title}
                            content={faq.content}
                          />
                        </div>
                      );
                    })}
                  </section>
                  {data.embedded_videos.length != 0 && <span className="text-xl pt-10 underline">
                    Embedded Videos
                  </span>}
                  
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
                  {data.articles.length != 0 && <span className="text-xl pt-10 underline">Articles</span>}

                  <section className="w-full text-center flex flex-col pt-4">
                    {data.articles.map((article: any) => {
                      return (
                        <div
                          key={`${
                            JSON.stringify(article) + new Date().toISOString()
                          }`}
                        >
                          <ArticleCard
                            link={`/admin/${routeParams.state}/${routeParams.city}/${article.slug}`}
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
      )}
    </>
  );
}

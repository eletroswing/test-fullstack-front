import { useState } from "react";

/* eslint-disable react/no-unescaped-entities */
export default function Collapsible({ title, content }: any) {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <button className="w-full text-left mb-4" onClick={handleClick}>
        <div className="w-full flex justify-between mb-2">
          <span className="font-medium text-md">
            {title || "Accordition"}
          </span>
          <span className="font-bold text-md">{isOpen ? "-" : "+"}</span>
        </div>
        {isOpen && (
            <span className="pt-2 text-left">{content || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quas dolorum vitae et deleniti reiciendis sequi quaerat animi vel eligendi sit enim, magnam magni nulla, voluptate commodi ratione! Culpa, magni sed quas iste illum amet, quis libero molestiae perferendis iure laborum perspiciatis ducimus, possimus minus distinctio assumenda sequi a nulla."}</span>
        )}
      </button>
    </div>
  );
}

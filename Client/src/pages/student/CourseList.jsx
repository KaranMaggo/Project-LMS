import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import Searchbar from "../../Components/Student/Searchbar";
import { useParams } from "react-router-dom";
import CourseCard from "../../Components/Student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../Components/Student/Footer";

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tmpCourses = allCourses.slice();

      input
        ? setFilteredCourse(
            tmpCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tmpCourses);
    }
  }, [allCourses, input]);

  //3.16.26
  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-600">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              /<span>Course List</span>
            </p>
          </div>
          <Searchbar data={input} />
        </div>
      {
        input && <div className=" inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-800">
          <p>{input}</p>
          <img src={assets.cross_icon} alt=""  className="cusror-pointer" onClick={(()=>{
            navigate('/course-list')
          })}/>
          </div>
      }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:px-0">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CourseList;

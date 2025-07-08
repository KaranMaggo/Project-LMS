import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import Youtube from 'react-youtube'
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAllreadyEnrolled, setAllreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);


  const {
    allCourses,
    calcualateRating,
    getToken,
    calculateChapterTime,
    calculateCourseDuration,
    calcualateNoOfLectures,
    currency,backendUrl,userData
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const {data}=await axios.get(backendUrl+'/api/course/'+id)
      if(data.success){
        setCourseData(data.courseData)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
      
    }
  };

  const toggleSection = (i) => {
    setOpenSection((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const enrollCourse=async()=>{
    try {
      if(!userData){
        return toast.warn('Login to Enroll')
      }
      if(isAllreadyEnrolled){
        return toast.warn('Already Enrolled')
      }
const token= await getToken();
const {data}= await axios.post(backendUrl +'/api/user/purchase',
  {courseId:courseData._id},
  {headers:{Authorization:`Bearer ${token}`}})
if(data.success){
  const {session_url}=data
  console.log(data);
  window.location.replace(session_url)
}
else{
  toast.error(data.message)
}
    } catch (error) {
  toast.error(error.message)
      
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, []);
  useEffect(() => {
  if (userData?.enrolledCourse?.includes(courseData?._id)) {
  setAllreadyEnrolled(true);
} else {
  setAllreadyEnrolled(false);
}

  }, [userData,courseData]);
  return courseData ? (
    <>
      <div
        className="flex md:flex-row flex-col-reverse gap-10 relative items-start
    justify-between md:px-36 px-8 md:pt-30 pt-20 text-left"
      >
        <div
          className="absolute top-0 left-0 w-full h-[500px] z-0
      bg-gradient-to-b from-cyan-100/70"
        ></div>
        {/* left column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1
            className="md:text-[40px]
  text-[30px] font-semibold text-gray-800"
          >
            {courseData.courseTitle}
          </h1>
          <p
            className=" pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* review and rating */}

          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calcualateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  className="w-3.5 h-3.5"
                  key={i}
                  src={
                    i < Math.floor(calcualateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                />
              ))}
            </div>
            <p className="text-gray-500">
              ({courseData.courseRatings?.length}
              {courseData.courseRatings?.length > 1 ? " ratings" : " rating"})
            </p>
            <p className="text-blue-600">
              {courseData.enrolledStudents?.length}
              {courseData.enrolledStudents?.length > 1 ? " students" : "student"}
            </p>
          </div>
          <p className="text-sm ">
            Course by<span className="text-blue-600"> {courseData.educator.name}</span>
          </p>
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            <div className="pt-5 ">
              {courseData.courseContent.map((chapter, i) => (
                <div
                  key={i}
                  className="border border-gray-300 bg-white mb-2 rounded "
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(i)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow-icon"
                        className={`transform transition-transform ${
                          openSection[i] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length}lectures-
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300  
            ${openSection?.[i] ? "max-h-96" : "max-h-0"}`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li className="flex items-start gap-3 py-1" key={i}>
                          <img
                            src={assets.play_icon}
                            alt="play-icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>

                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p  onClick={()=>setPlayerData(
                                  {
                                    videoId:lecture.lectureUrl.split('/').pop()
                                  })}className="text-blue-500 cursor-pointer">
                                  Preview
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          <div className="pt-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className=" pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
        </div>

        {/* Right Column */}
        <div className="max-w-[424px] z-10   rounded-t md:rounded-none overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)] bg-white min-w-[300px] sm:min-w-[420px]">
          {
              
                playerData?<Youtube videoId={playerData.videoId} opts={{playerVars:{autoplay:1}}}
                iframeClassName="w-full aspect-video"/>:<img src={courseData.courseThumbnail} alt="" />
              }
          
          <div className="p-5">
            <div className="flex items-center gap-2">
             <img className="3.5w " src={assets.time_clock_icon} alt="" />
              
          <p className="text-red-500">
                <span className="font-medium">5 days</span> left at this Price
              </p>
            </div>
            <div className="flex gap-3 items-center p-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency}
                {courseData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount}% off
              </p>
            </div>

            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star_icon" />
                <p>{calcualateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="time_icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson_icon" />
                <p>{calcualateNoOfLectures(courseData)} Lessons</p>
              </div>
            </div>
            <button onClick={enrollCourse} className="md:mt-5 mt-4  py-3 rounded bg-blue-500 w-full text-white font-medium">
              {isAllreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

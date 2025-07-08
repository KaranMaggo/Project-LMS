/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"; // ✅ correct spelling
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from 'axios'
import {toast} from 'react-toastify'
  



export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
 const [userData,setUserData]=useState(null);


  const {getToken}=useAuth()
  const {user}=useUser()

  // fetch all course

  const fetchAllCourse = async () => {
    try {
      const {data}=await axios.get(backendUrl+'/api/course/all')
      if(data.success){
        console.log(data);
       setAllCourses(data.courses)
      }else{
         toast.error(data.message)
      }
    } catch (error) {
         toast.error(error.message)
      
    }
  };

  //fetch User data
  const fetchUserData=async()=>{
    if(user.publicMetadata.role==='educator'){
      setIsEducator(true)
    }
    try {
      const token= await getToken();
     const {data}= await axios.get(backendUrl+'/api/user/data',{
        headers:{Authorization:`Bearer ${token}`}
      })

      if(data.success){
        setUserData(data.user)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
      
    }
  }

  // function to calcualate average rating of course

  const calcualateRating = (course) => {
     if (!course.courseRatings || course.courseRatings.length === 0) {
    return 0;
  }

    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length)
  };

  // function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { unita: ["h", "m"] });
  };
  // function to calculate course time

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // function to calcualate no of lectures in the course

  const calcualateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // fetch userEnrolled Courses
  const fetchuserEnrolledCourses= async()=>{
try{
   const token =await getToken();
   const{data}=await axios.get(backendUrl+'/api/user/enrolled-courses',{
    headers:{
      Authorization:`Bearer ${token}`}})

      if(data.success)
        {setEnrolledCourses(data.enrolledCourses.reverse())}
  else{
    toast.error(data.message)
  }
}

catch(error){
  toast.error(error.message)
}
  }
  useEffect(() => {
    fetchAllCourse();
  }, []);

  

  useEffect(()=>{
 if(user){
  fetchUserData()
  fetchuserEnrolledCourses()
 }
  },[user])
  const value = {
    currency,
    allCourses,
    navigate,
    calcualateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calcualateNoOfLectures,
    enrolledCourses,fetchuserEnrolledCourses,backendUrl,userData,setUserData,getToken,fetchAllCourse
  };
  

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

//2.27.46 -12.11

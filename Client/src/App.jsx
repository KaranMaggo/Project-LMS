import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import CourseList from "./Pages/Student/CourseList";
import CourseDetails from "./Pages/Student/CourseDetails";
import MyEnrollments from "./Pages/Student/MyEnrollments";
import Player from "./Pages/Student/Player";
import Loading from "./Components/Student/Loading";
import Educator from "./Pages/Educator/Educator";
import DashBorad from "./Pages/Educator/DashBorad";
import AddCourse from "./Pages/Educator/AddCourse";
import MyCourse from "./Pages/Educator/MyCourse";
import StudentEnrolled from "./Pages/Educator/StudentEnrolled";
import Navbar from "./Components/Student/Navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import Home from "./Pages/Student/Home";



const App = () => {
  const isEducatorRoute=useMatch('/educator/*')
  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar/>}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseid" element={<Player />} />
        <Route path="/loader/:courseid" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<DashBorad />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-course" element={<MyCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

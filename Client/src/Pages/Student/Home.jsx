import React from "react";
import Hero from '../../Components/Student/Hero'
import Companies from "../../Components/Student/Companies";
import CourseSection from "../../Components/Student/CourseSection";
import Testimonial from "../../Components/Student/Testimonial";
import CallToAction from "../../Components/Student/CallToAction";
import Footer from "../../Components/Student/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero/>
      <Companies/>
      <CourseSection/>
      <Testimonial/>
      <CallToAction/>
      <Footer/>
    </div>
  );
};

export default Home;

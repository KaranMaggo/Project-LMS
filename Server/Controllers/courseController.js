import Course from "../Models/Course.js";

//get all course

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isPublished: true,
    })
      .select("-courseContent -enrolledStudents")
      .populate({ path: "educator" });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get Course by Id

export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    //remove lectureUrl if is Preview is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lectue) => {
        if (!lectue.isPreviewFree) {
          lectue.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

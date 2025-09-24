const dotenv=require("dotenv");
dotenv.config();

const cors=require("cors");
const exp=require("express");
const app=exp();

app.use(exp.json());
app.use(cors());




const Studentrouter=require("./router/Student");
app.use("/Student",Studentrouter);

const userrouter=require("./router/user");
app.use("/user",userrouter);

const quick_admissionrouter=require("./router/quick_admission");
app.use("/quick_admission",quick_admissionrouter);

const countryrouter=require("./router/country");
app.use("/country",countryrouter);

const staterouter=require("./router/state");
app.use("/state",staterouter);

const cityrouter=require("./router/city");
app.use("/city",cityrouter);

const user_typerouter=require("./router/user_type");
app.use("/user_type",user_typerouter);

const user_subtyperouter=require("./router/user_subtype");
app.use("/user_subtype",user_subtyperouter);

const superLogin=require("./router/superLogin");
app.use("/superLogin",superLogin);


// const Gardianrouter=require("./router/Gardian")
// app.use("/Gardian",Gardianrouter)


 // const Application_formrouter=require("./router/Application_form")
 // app.use("/Application_form",Application_formrouter)


// const Classrouter=require("./router/Class")
// app.use("/Class",Classrouter)

// const Teacherrouter=require("./router/Teacher")
// app.use("/Teacher",Teacherrouter)

// const Eventrouter=require("./router/Event")
// app.use("/Event",Eventrouter)

// const Paymentrouter=require("./router/Payment")
// app.use("/Payment",Paymentrouter)

// const Queryrouter=require("./router/Query")
// app.use("/Query",Queryrouter)

// const Feedbackrouter=require("./router/Feedback")
// app.use("/Feedback",Feedbackrouter)

// const Feedback_Questionsrouter=require("./router/Feedback_Questions")
// app.use("/Feedback_Questions",Feedback_Questionsrouter)

// const Subjectrouter=require("./router/Subject")
// app.use("/Subject",Subjectrouter)

// const Attendancerouter=require("./router/Attendance")
// app.use("/Attendance",Attendancerouter)

// const Timetablerouter=require("./router/Timetable")
// app.use("/Timetable",Timetablerouter)

// const Exam=require("./router/Exam")
// app.use("/Exam",Examrouter)

// const Exam_resultrouter=require("./router/Exam_result")
// app.use("/Exam_result",Exam_resultrouter)

// const Libraryrouter=require("./router/Library")
// app.use("/Library",Libraryrouter)

// const Noticerouter=require("./router/Notice")
// app.use("/Notice",Noticerouter)

// const Transportrouter=require("./router/Transport")
// app.use("/Transport",Transportrouter)

// const Activitiesrouter=require("./router/Activities")
// app.use("/Activities",Activitiesrouter)

// const Hostelrouter=require("./router/Hostel")
// app.use("/Hostel",Hostelrouter)

// const Medicalrouter=require("./router/Medical")
// app.use("/Medical",Medicalrouter)

// const pincoderouter=require("./router/pincode");
// app.use("/pincode",pincoderouter);




// const docsrouter=require("./docs")
// app.use("/docs",docsrouter)


app.listen(process.env.APP_PORT);
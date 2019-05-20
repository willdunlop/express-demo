import express from "express";

const PORT = process.env.PORT || 3000;  //  env variable is set with `export PORT = 8000` as an example

/** Initiate the app */
const app = express();
/** Configure app and it's middleware */
app.use(express.json());

/** Dummy data becase fuck databses for now */
const courses = [
    { id: 1, name: "Course-01" },
    { id: 2, name: "Course-02" },
    { id: 3, name: "Course-03" },
]

/** Write up some endpoints */
app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const courseName = req.body.name;
    if (!courseName || courseName.length < 3) { res.status(400).send("")}
    const course = {
        id: courses.length + 1,
        name: courseName,
    };
    courses.push(course);
    res.send(course);
})

app.get("/api/courses/:id", (req, res) => {
    const id = req.params.id   //  Params are pulled from req
    const queries = req.query   //  Queries are pulled from
    const selectedCourse = courses.find(course => course.id === parseInt(id));
    if(!selectedCourse) { res.status(404).send("Course could not be found"); }
    res.send(selectedCourse);
})

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
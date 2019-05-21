import express from "express";
import Joi from "joi";
import helmet from "helmet";
import morgan from "morgan";
import config from "config";
import debug from "debug";

const log = {
    info: debug("app:info"),
    db: debug("app:db"),
    launch: debug("app:launch")
}

const PORT = process.env.PORT || 3000;  //  env variable is set with `export PORT = 8000` as an example

/** Initiate the app */
const app = express();
const isProd = process.env.NODE_ENV === "production";
/** 
 * Configure app and it's middleware.
 * Every request passes through the middleware before being handled by one of the 
 * route handlers below
 */
app.use(helmet());                                          // Some decent protection for the app
app.use(express.json());                                    //  Will parse JSON formats
app.use(express.urlencoded({ extended: true }))             //  will parse urlencoded key=value&key=value
if (!isProd) app.use(morgan("tiny"));                       // Logs shit, disable when prod
// app.use(express.static("public"));                       //  Serves the static folder called public   

log.launch("AppName", config.get("name"));

app.use(function(req, res, next) {                          //  'next' refers to the next function in the middleware pipeline
    console.log()                       //  If you dont use next the app will hang
})

/** Dummy data becase fuck databses for now */
const courses = [
    { id: 1, name: "Course-01" },
    { id: 2, name: "Course-02" },
    { id: 3, name: "Course-03" },
]

// log.db("Courses", courses)

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}



/** Write up some endpoints */
app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const result = validateCourse(req.body);
    if (result.error) { return res.status(400).send(result.error.details[0].message); }

    const courseName = req.body.name;
    const course = {
        id: courses.length + 1,
        name: courseName,
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    const id = req.params.id   //  Params are pulled from req
    const selectedCourse = courses.find(course => course.id === parseInt(id));
    if(!selectedCourse) { return res.status(404).send("Course could not be found"); }

    const result = validateCourse(req.body);
    if (result.error) { return res.status(400).send(result.error.details[0].message); }

    selectedCourse.name = req.body.name;
    res.send(selectedCourse);
});

app.delete("/api/courses/:id", (req, res) => {
    const id = req.params.id   //  Params are pulled from req
    const selectedCourse = courses.find(course => course.id === parseInt(id));
    if(!selectedCourse) { return res.status(404).send("Course could not be found"); }

    const index = courses.indexOf(selectedCourse);
    courses.splice(index, 1);
})


// app.get("/api/courses/:id", (req, res) => {
//     const id = req.params.id   //  Params are pulled from req
//     const queries = req.query   //  Queries are pulled from
//     const selectedCourse = courses.find(course => course.id === parseInt(id));
//     if(!selectedCourse) { res.status(404).send("Course could not be found"); }
//     res.send(selectedCourse);
// })

app.listen(PORT, () => log.info(`App is listening on port ${PORT}`));
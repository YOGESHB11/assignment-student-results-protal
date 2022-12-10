const express = require("express")
const mongoose = require("mongoose")
const route = require("./routes/route")
const app = express()

app.use(express.json())

mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://Yogesh-B:rL3Qx2k0KgDJLnKK@cluster0.xffx0d4.mongodb.net/studentMarks-DB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
    }).then(() => console.log("mongoDb is connected"))
    .catch((err) => console.log(err));

app.use("/", route)

app.use("/*", function (req, res) {
    return res.status(400).send({ status: false, message: "Invalid Path Or Parameters !!!!", });
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000));
});

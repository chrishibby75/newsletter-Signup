const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
const https = require("https");

const PORT = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
       members: [
           {
               email_address: email,
               status: "subscribed",
               merge_fields: {
                   FNAME: firstName,
                   LNAME: lastName
               }
           }
       ] 
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us10.api.mailchimp.com/3.0/lists/9d3a84b0d4';
    const options = {
        method: "POST",
        auth: "chrishibby:48fab3180235fcadfe65377dcf20992e-us10"
    }

    const request = https.request(url, options, response => {
        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, "success.html"));
        } else {
            res.sendFile(path.join(__dirname, "failure.html"));
        }
        response.on("data", function(data) {
            // console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
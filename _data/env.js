
require('dotenv').config();

let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();
console.log(process.env.API)
module.exports = {
    YEAR: _YEAR,
    TITLE: "BACKPAGE GENERATOR",
    APIURL: process.env.APIURL,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET,
    ADMINURL: process.env.ADMINURL,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    LEVEL1NAME: "projects",
    LEVEL2NAME: "project",
    ITEMSDATAMAIN: "items",
    DASHBOARDSTRAP: "Welcome to the content editor.",
    CANCREATEACCOUNT: process.env.CANCREATEACCOUNT,
    COMPLEXPASSWORD: process.env.COMPLEXPASSWORD
}
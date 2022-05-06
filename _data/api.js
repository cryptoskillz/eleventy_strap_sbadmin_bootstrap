//remove the comments when you have wired up the API
require('dotenv').config();
const superagent = require('superagent');

//async function to get the posts
getData = async () => {
    console.log(`${process.env.STRAPIAPI}backpage-projects/`)
    var res = await superagent.get(`${process.env.STRAPIAPI}backpage-projects/`).query({});
    //console.log(res.body)
    return (res.body)
}


module.exports = async () => {
    //set an array 
    let properties = []
    //call the get get Data fuction
    if (properties.length === 0) properties = await getData();
    //console.log(properties[0].id)

    return {
        propertiesArray: properties
    }

}
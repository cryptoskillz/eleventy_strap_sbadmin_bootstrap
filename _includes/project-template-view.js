let projectid = 0;
let dataid = 0


let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}



whenDocumentReady(isReady = () => {
    let valid = 1;
    //check for a projectid
    let urlParam = getUrlParamater('projectid');
    if (urlParam != "")
    {
        projectid = urlParam
        urlParam = getUrlParamater('dataid');
        if (urlParam != "")
        {
            dataid = urlParam
        } 
    }
    else
        valid = 0;

    //debug
    //console.log(projectid)
    //console.log(dataid)

    //check if it is black
    if (valid ==1) {
        //done function
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            let results = []
            let keys;
            let theData
            //get the keys from the first data.
            for (var i = 0; i < res.data.length; ++i) {
                //if we dont have a dataid passed set it to the first records id so it will be found in the next loop
                if (dataid == 0)
                    dataid = res.data[i].id 
                if (res.data[i].id == parseInt(dataid))
                {
                    theKeys = Object.keys(res.data[i].attributes.data)
                    theData = res.data[i].attributes.data
                }
            }

            //get the template
            let xhrDone2 = (res) => {
                res = JSON.parse(res)
                let theCode = res.data.attributes.template;
                //console.log(theCode)
                if ((theCode == "") || (theCode == null)) {
                    //alert('No template')
                    document.getElementById("projectemplate").innerHTML = "Template not found for this project, please go back."
                } else {

                    for (var key in theData) {
                        //console.log(key + " -> " + theData[key]);
                        for (var key2 in theKeys) {
                            //console.log(key2 + " -> " + theKeys[key2]);
                            if (key == theKeys[key2]) {
                                //console.log("foundit")
                                //console.log(key + " " + theKeys[key2] + " " + theData[key]);
                                let keyReplace = `\{\{${key}\}\}`
                                //console.log(keyReplace)
                                theCode = theCode.replace(keyReplace, theData[key])
                            }
                        }
                    }
                    console.log(theData)
                    if (theData == undefined)
                        theCode= "No data added for this project"+theCode
                    document.open();
                    document.write(theCode);
                    document.close();
                }
            }

            //call the create account endpoint
            xhrcall(1, `backpage-projects/${projectid}`, "", "json", "", xhrDone2, token)

        }
        //build the json
        let bodyobj = {
            user: {
                id: 2
            }

        }
        //string it
        var bodyobjectjson = JSON.stringify(bodyobj);
        //get the data so we can get the keys for the elements
        xhrcall(1, "backpages/?user=1", bodyobj, "json", "", xhrDone, token)
    }
    else
    {
        document.getElementById("projectemplate").innerHTML = "No project id found."
    }
})
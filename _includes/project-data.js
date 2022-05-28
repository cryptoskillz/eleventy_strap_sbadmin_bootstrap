//add a ready function
let projectid;
let backpages;

let zipBackPages = () => {
    let xhrDone = (res) => {
        res = JSON.parse(res)
        let theCode = res.data.attributes.template;
        let theTemplateName = res.data.attributes.templatename;
        if ((theCode == "") || (theCode == null)) {
            alert('No template')
        } else {
            //process the data
            let keys;
            let theData;
            let theName
            //init the zipper
            let zip = new JSZip();
            //loop through the pages
            for (var i = 0; i < backpages.data.length; ++i) {
                //the keys should not be different so we could move this out of the loop
                theKeys = Object.keys(backpages.data[i].attributes.data)
                //get the data
                theData = backpages.data[i].attributes.data
                //set the template
                theName = theTemplateName
                //loop through the data
                for (var key in theData) {
                    //loop through the keys
                    for (var key2 in theKeys) {
                        //check if we have a matching key
                        if (key == theKeys[key2]) {
                            //set it up to suport liqiud
                            let keyReplace = `\{\{${key}\}\}`
                            //replace the key in the template with the data
                            theCode = theCode.replace(keyReplace, theData[key])
                            //check it is not blank
                            if (theData[key] != "")
                                theName = theName.replace(keyReplace, theData[key])
                            else
                                theName = theName.replace(keyReplace, "")
                        }
                    }
                }
                //add the zip file
                zip.file(`backpages/${theName}/index.html`, theCode);
            }
            //create the zip
            zip.generateAsync({
                type: "base64"
            }).then(function(content) {
                window.location.href = "data:application/zip;base64," + content;
            });
        }
    }
    //get the project details
    xhrcall(1, `backpage-projects/${projectid}`, "", "json", "", xhrDone, token)
}

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    //get the  template id
    let urlParam = getUrlParamater('projectid')
    if (urlParam != '') {
        projectid = urlParam;
        //done function
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            //console.log(res)
            renderTable(res, 1, 0, [1, 0, 1, 1], 'backpages')

        }
        //build the json
        let bodyobj = {
            user: {
                id: 2
            }

        }

        if (urlParam != "") {
            //string it
            document.getElementById("showBody").classList.remove('d-none')
            var bodyobjectjson = JSON.stringify(bodyobj);
            //call the create account endpoint
            xhrcall(1, "backpages/?user=1", bodyobj, "json", "", xhrDone, token)
        }
    } else {
        showAlert(`project not found add one`, 2,0)
    }




})

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            window.location.href = `/project/data/import/?projectid=${projectid}`
            break;
        case "2":
            zipBackPages()
            break;
        case "3":
            window.location.href = `/project/data/new/?projectid=${projectid}`
            break;
        case "4":
            window.location.href = `/projects/`
            break;
        default:
            // code block
    }
    this.value = 0;

})
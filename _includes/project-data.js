/*

todo 

remove the data-import-data code and replace with just data import
when we do the csv import it goes back to poject-data
schema editing moving to project-data-schema

we will store all the data from the import and then look at the fields paramater to decide if we are to use the data or not
we can do this front or backend I think backend is best that way we can prefilter the data 

add record will rely on the schema to be set


*/
let backpages;

let zipBackPages = () => {
    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        project = JSON.parse(project)
        let theCode = project.template;
        let theTemplateName = project.templatename;
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
                let tmpCode = theCode;
                //the keys should not be different so we could move this out of the loop
                theKeys = Object.keys(backpages.data[i].data)
                //console.log(theKeys)
                //get the data
                theData = backpages.data[i].data
                //console.log(theData)
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
                            tmpCode = tmpCode.replace(keyReplace, theData[key])
                            //check it is not blank
                            if (theData[key] != "")
                                theName = theName.replace(keyReplace, theData[key])
                            else
                                theName = theName.replace(keyReplace, "")
                        }
                    }
                }
                //console.log(tmpCode)
                //add the zip file
                zip.file(`backpages/${theName}/index.html`, tmpCode);
            }
            //create the zip
            zip.generateAsync({
                type: "base64"
            }).then(function(content) {
                window.location.href = "data:application/zip;base64," + content;
            });
        }
    }
    /*
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
                let tmpCode = theCode;
                //the keys should not be different so we could move this out of the loop
                theKeys = Object.keys(backpages.data[i].attributes.data)
                //get the data
                theData = backpages.data[i].attributes.data
                //console.log(theData)
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
                            tmpCode = tmpCode.replace(keyReplace, theData[key])
                            //check it is not blank
                            if (theData[key] != "")
                                theName = theName.replace(keyReplace, theData[key])
                            else
                                theName = theName.replace(keyReplace, "")
                        }
                    }
                }
                //console.log(tmpCode)
                //add the zip file
                zip.file(`backpages/${theName}/index.html`, tmpCode);
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
    */
}

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        project = JSON.parse(project)
        //done function
        let xhrDone = (res) => {
            //parse the response
            backpages = JSON.parse(res)
            if (backpages.data.length == 0)
                showAlert(`No data added, click <a href="/project/data/import/">here<a/> to import from a CSV`, 2, 0)
            else {
                //store the first project for demo rendering
                window.localStorage.projectdata = JSON.stringify(backpages.data[0])
                document.getElementById("showBody").classList.remove('d-none')
                renderTable(backpages, [1, 0, 1, 1], "api/projectdata")

            }

        }
        //call the create account endpoint
        xhrcall(1, `api/projectdata/?projectid=${project.id}`, "", "json", "", xhrDone, token)
    }

})

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            window.location.href = `/project/data/import/`
            break;
        case "2":
            window.location.href = `/project/data/schema/`
            break;
         case "3":
            window.location.href = `/project/data/template/`
            break;           
        case "4":
            zipBackPages()
            break;
        case "5":
            window.location.href = `/project/data/new/`
            break;
        case "6":
            window.location.href = `/projects/`
            break;
        default:
            // code block
    }
    this.value = 0;

})
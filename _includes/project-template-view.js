/*
when we have done the data import we have to rebuild this


*/
let projectid = 0;
let dataid = 0


let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the project
    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        //hold the fields
        let theFields;
        ////hold the template
        let theTemplate;
        //hold the data
        let theData;
        //get the project data
        let projectdata = window.localStorage.projectdata

        projectdata = JSON.parse(projectdata);
        console.log(projectdata)
        //get the project
        project = JSON.parse(project);
        //set the template
        theTemplate = project.template;
        //get the fields
        theFields = Object.keys(projectdata)
        //get the data
        theData = Object.values(projectdata)
        //loop through the data
        for (var i = 0; i < theFields.length; ++i) {
            element = `\{\{${theFields[i]}\}\}`
            theTemplate = theTemplate.replace(element, theData[i]);
        }
        //check we have data
        if (theData.length == "")
            theTemplate = "No data added for this project"

        //check we have a template
        if (theTemplate== "")
            theTemplate = "No template added for this project"
        document.open();
        document.write(theTemplate);
        document.close();
    }
})
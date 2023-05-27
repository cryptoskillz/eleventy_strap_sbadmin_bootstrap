/*

todo 

remove the data-import-data code and replace with just data import
when we do the csv import it goes back to poject-data
schema editing moving to project-data-schema

we will store all the data from the import and then look at the fields paramater to decide if we are to use the data or not
we can do this front or backend I think backend is best that way we can prefilter the data 

add record will rely on the schema to be set


*/
let project = JSON.parse(window.localStorage.currentDataItem);
let results;


let loadURL = (theUrl, theId, blank = 0) => {
    //update this to use generic finctions
    //console.log(backpages)
    window.localStorage.currentDataItemId = theId
    if (blank == 1)
        window.open(theUrl, "_blank")
    else {
        window.location.href = theUrl;
    }

}

//table render
let renderTable = (data, actions = [], method = "") => {
    //parse the results
    results = JSON.parse(data)
    //build the columns from the scheama
    let columns = [];
    //set the unsed fields
    //note: may not be used anymore
    let unusedFields = [];
    //store the process data results
    let dataresult = [];
    //add an id column as this is not a generic rendered we can get away with hard coding this
    colJson = { title: "id" };
    //add the column
    columns.push(colJson);
    //loop through the schema and add the columns
    for (var i = 0; i < results.schema.length; i++) {
        //check if it is used
        if (results.schema[i].isUsed == 1) {
            //add it
            colJson = { title: results.schema[i].fieldName }
            columns.push(colJson);
        } else {
            // is this required
            unusedFields.push(i)
        }
    }

    //add the actions column
    if (actions.length != 0) {
        columns.push({ title: "actions" })
    }
    //debug
    //console.log(results.schema)  
    //console.log(results.data);
    //console.log(columns);

    //loop through the data
    for (var i = 0; i < results.data.length; ++i) {
        //get the row
        let theRow = results.data[i];
        //set an array for each data field
        let theFields = [];
        //loop through the fields
        for (var i2 = 0; i2 < theRow.length; ++i2) {
            //check if it is the first pass and add the project id
            if (i2 == 0)
                theFields.push(theRow[i2].projectDataId)
            //add the field values
            theFields.push(theRow[i2].fieldValue)

        }

        //check if we want to add actions 
        //note we could remove this as we will always require actions on this render
        if (actions.length != 0) {
            //hold the buttons
            let buttons = "";
            //edit button
            if (actions[0] == 1)
                buttons = buttons + `<a href="javascript:loadURL('/project/data/edit/','${theFields[0] }')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            //publish button
            if (actions[1] == 1)
                buttons = buttons + `<a href="/project/data/?id=${theFields.id }" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>`
            //view button
            if (actions[2] == 1)
                buttons = buttons + `<a  href="javascript:loadURL('/project/template/view/','${theFields[0] }',1)" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50" ></i> View</a>`
            //delete button
            if (actions[3] == 1)
                buttons = buttons + `<a href="javascript:deleteTableItem('${theFields[0] }','projectdata/')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
            theFields.push(buttons);
            //theValue = theRow[i2].fieldValue;

        }
        //add the row to the array
        dataresult.push(Object.values(theFields));
    }

    //add the data to the table we want row 0 to be the id which is the ID so we can soft delete etc.
    table = $('#dataTable').DataTable({
        data: dataresult,
        rowId: "0",
        columns: columns,

    });

}

let zipBackPages = () => {
    //init zip
    let zip = new JSZip();
    //set a valid flag
    let valid = 1;
    //check we have some data
    if ((results.data.length == "") || (results.data == null) || (results.data == null)) {
        showAlert('No data for this project add some here <a href="/project/data/import/">here</a>', 2)
        valid = 0;
    }

    //check we have a template
    if ((results.template.template == "") || (results.template.template == null)) {
        showAlert('Template is not set set it <a href="/project/data/template">here</a>', 2)
        valid = 0;
    }

    //debug
    //results.template.name = "";
    //checkw we have a template name
    if ((results.template.name == "") || (results.template.name == null)) {
        showAlert('Template name is not set using GUID set it here if you want specific names <a href="/project/data/template">here</a>', 2)
    }
    //check if we should process the templates
    if (valid == 1) {
        //get the first row of data
        let theData = results.data;
        //make sure we have data and someone is not trying to be naughty
        //loop through the data
        for (var i = 0; i < results.data.length; ++i) {
            //get the row
            let theRow = results.data[i];
            //console.log(theRow)
            //set the template
            let tmpTemplate = results.template.template;
            //set the template name
            tmpName = results.template.name
            //loop through the fields
            for (var i2 = 0; i2 < theRow.length; ++i2) {
                //get the element
                let theElement = `\{\{${theRow[i2].fieldName}\}\}`;
                //replace it
                tmpTemplate = tmpTemplate.replace(theElement, theRow[i2].fieldValue);
                //check if its the template name and replace it
                if (theRow[i2].fieldName == tmpName)
                    tmpName = tmpName.replace(`${theRow[i2].fieldName}`, `${theRow[i2].fieldValue}`)
            }
            //if there is not template name set the GUID
            if (tmpName == "")
                tmpName = `${theRow[0].projectDataId}`;
            zip.file(`backpages/${tmpName}/index.html`, tmpTemplate);
        }
        //create the zip file
        zip.generateAsync({
            type: "base64"
        }).then(function(content) {
            window.location.href = "data:application/zip;base64," + content;
        });

    }


}

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let xhrDone = (res) => {
        if (res.length == 0)
            showAlert(`No data added, click <a href="/project/data/import/">here<a/> to import from a CSV`, 2, 0)
        else {
            projectData = JSON.parse(res);
            document.getElementById("showBody").classList.remove('d-none')
            if ((res.length != 0) && (res != "") && (res != null))
                renderTable(res, [1, 0, 1, 1], "api/projectdata")

        }

    }
    let project = JSON.parse(window.localStorage.currentDataItem);
    xhrcall(1, `${apiUrl}projectdata/?projectId=${project.id}&getTemplate=1`, "", "json", "", xhrDone, token)

})

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            window.location.href = `/project/data/import/`
            break;
        case "2":

            let templateDone = (res) => {
                //prcess the results
                results = JSON.parse(res);
                //check we have some 
                if ((results.length != 0) && (results != "") && (results != null)) {
                    let valid = 1;
                    if (projectData.data.length == 0) {
                        showAlert(`Unable to view template as no data has been added to add some click <a href="/project/data/import/">here</a>`, 2)
                        valid = 0;
                    }

                    if (results.template.template == "") {
                        showAlert(`Unable to view template as no data has been added to add some click <a href="/project/data/import/">here</a>`, 2)
                        valid = 0;
                    }


                    if (results.template.name == "") {
                        showAlert(`Please add a template name to view it`, 2)
                        valid = 0;

                    }

                    if (valid == 1) {
                        let url = `/api/export/export/?projectId=${project.id}&secretId=${user.secret}`
                        window.open(`${url}`, '_blank');

                    }




                }


            }
            //make the call.
            xhrcall(1, `${apiUrl}projectdata/?projectId=&getTemplate=1&projectDataId=${window.localStorage.currentDataItemId}`, "", "json", "", templateDone, token)




            /*
             if ((project.schema.originalfields == "") || (project.schema.originalfields == null)) {
                 showAlert(`Unable to view template as no data has been added to add some click <a href="/project/data/import/">here</a>`, 2)
                 valid = 0;
             }

             if ((project.template == "") || (project.template == null)) {
                 showAlert(`Please save the template to view it`, 2)
                 valid = 0;

             }

             if ((project.templatename == "") || (project.templatename == null)) {
                 showAlert(`Please add a template name to view it`, 2)
                 valid = 0;

             }
             if (valid == 1) {
                 let url = `/api/export/export/?projectid=${project.id}&secretid=${user.secret}`
                 window.open(`${url}`, '_blank');

             }
             */

            break;
        case "3":
            window.location.href = `/project/data/schema/`
            break;
        case "4":
            window.location.href = `/project/data/template/`
            break;
        case "5":
            zipBackPages()
            break;
        case "6":
            if ((results.data.length != 0) && (results.data != "") && (results.data != null))
                window.location.href = `/project/data/new/`
            else
                showAlert(`No data added, click <a href="/project/data/import/">here<a/> to import from a CSV before you can add records`, 2)
            break;
        case "7":
            window.location.href = `/projects/`
            break;
        default:
            // code block
    }
    this.value = 0;

})
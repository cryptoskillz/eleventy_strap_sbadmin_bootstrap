let project = JSON.parse(window.localStorage.currentDataItem);



let fields;
let originalfields;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //done function
    let xhrDone = (res) => {
        //set at input variable
        let inpHtml = "";
        //prcess the results
        results = JSON.parse(res);
        //check we have some 
        if ((results.length != 0) && (results != "") && (results != null)) {
            //loop through the results
            for (var i = 0; i < results.schema.length; ++i) {
                //get the row
                let theRow = results.schema[i];
                //check if it is used element
                if (theRow.isUsed == 1) {
                    //build the input elements
                    inpHtml = inpHtml + `<div class="form-group" >
                                            <label>${theRow.fieldName}</label>
                                            <input type="text" class="form-control form-control-user" id="inp-${theRow.fieldName}" aria-describedby="emailHelp" placeholder="Enter ${theRow.fieldName}" value="">
                                            </div>`
                } else {
                    //build the unused element
                    inpHtml = inpHtml + `    <div class="form-group" >
            <label>${theRow.originalFieldName} (note this is not used in the current schema)</label>
<input type="text" class="form-control form-control-user" id="inp-${theRow.originalFieldName}" aria-describedby="emailHelp" placeholder="Enter ${theRow.originalFieldName}" value="">
</div>`
                }


            }
            //set the header
            document.getElementById('project-header').innerHTML = `Add Record`;
            //add the elements
            document.getElementById('formInputs').innerHTML = inpHtml
            //show the body
            document.getElementById('showBody').classList.remove('d-none');
        } else {
            //record not found
            showAlert(`record not found`, 2, 0)
        }

    }
    //make the call.
    if ((project == undefined) || (project == null) || (project == ""))
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else
        xhrcall(1, `${apiUrl}projectdata/?projectId=${project.id}&projectDataId=`, "", "json", "", xhrDone, token)

})


document.getElementById('btn-create-data').addEventListener('click', function() {
    //done function
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        //show the done message
        showAlert(res.message, 1, 0);
        //hide the header
        document.getElementById('project-header').classList.add("d-none");
        //hide the form inputs
        //note we could just blank them so they can add another
        document.getElementById('formInputs').classList.add("d-none");
        //hide the button create (same as above)
        document.getElementById('btn-create-data').classList.add("d-none");
    }
    //set a data array
    let data = [];
    //loop throuh the schema
    for (var i = 0; i < results.schema.length; ++i) {
        //get the trow
        const theRow = results.schema[i];
        //set an input value
        let inpValue = "";
        //check if it is being used
        if (theRow.isUsed == 0) {
            //set the original field name
            inpValue = document.getElementById("inp-" + theRow.originalFieldName).value;
            theRow.fieldValue = inpValue;

        } else {
            //set the new field name
            inpValue = document.getElementById("inp-" + theRow.fieldName).value;
            theRow.fieldValue = inpValue;
        }
        //add it to the array
        data.push(theRow);
    }
    //build the object
    let bodyobj = {
        data: data,
        projectId: project.id
    }
    //parse the JSON
    var bodyobjectjson = JSON.stringify(bodyobj);
    //make the call
    xhrcall(0, `${apiUrl}projectdata/`, bodyobjectjson, "json", "", xhrDone, token)
})
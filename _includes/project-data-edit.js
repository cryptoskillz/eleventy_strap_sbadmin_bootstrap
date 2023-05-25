let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    let project = JSON.parse(window.localStorage.currentDataItem);


    let xhrDone = (res) => {
        //set at input variable
        let inpHtml = "";
        //prcess the results
        let results = JSON.parse(res);
        //check we have some 
        if ((results.length != 0) && (results != "") && (results != null)) {
            //loop through the results
            for (var i = 0; i < results.data.length; ++i) {
                //get the row
                let theRow = results.data[i];
                //loop through the fields
                for (var i2 = 0; i2 < theRow.length; ++i2) {
                    if (theRow[i2].isUsed == 1) {
                        //build the input elements
                        inpHtml = inpHtml + `<div class="form-group" >
                                            <label>${theRow[i2].fieldName}</label>
                                            <input type="text" class="form-control form-control-user" id="inp-${theRow[i2].fieldName}" aria-describedby="emailHelp" placeholder="Enter ${theRow[i2].fieldName}" value="${theRow[i2].fieldValue}">
                                            </div>`
                    }
                }
            }
            //set the header
            document.getElementById('project-header').innerHTML = `Edit Record`;
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
    xhrcall(1, `${apiUrl}projectdata/?projectid=${window.localStorage.currentDataItemId}`, "", "json", "", xhrDone, token)
})


document.getElementById('btn-edit').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1);
        updateProjectAllData(res.data);
    }
    let data = {};

    let currentproject = getCurrentProject();
    let currentprojectdata = getCurrentProjectData();

    let projectfields = currentproject.schema.fields.split(",");
    let projectoriginalfields = currentproject.schema.originalfields.split(",")
    for (var i = 0; i < projectfields.length; ++i) {
        let inpValue = "";
        if (projectfields[i] == "UNUSED") {
            data[projectoriginalfields[i]] = inpValue;

        } else {
            inpValue = document.getElementById("inp-" + projectfields[i]).value;
            data[projectfields[i]] = inpValue;

        }
    }
    let bodyobj = {
        data: data,
        projectid: currentproject.id,
        dataid: currentprojectdata.id
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `api/projectdata/`, bodyobjectjson, "json", "", xhrDone, token)
})
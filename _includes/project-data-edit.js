let project = JSON.parse(window.localStorage.currentDataItem);
let projecDatatId = window.localStorage.currentDataItemId;
let results;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {


    let xhrDone = (res) => {
        //set at input variable
        let inpHtml = "";
        //prcess the results
        results = JSON.parse(res);
        //check we have some 
        if ((results.length != 0) && (results != "") && (results != null)) {
            //loop through the results
            for (var i = 0; i < results.data.length; ++i) {
                //get the row
                let theRow = results.data[i];
                //console.log(theRow);
                //loop through the fields

                if (theRow.isUsed == 1) {
                    //build the input elements
                    inpHtml = inpHtml + `<div class="form-group" >
                                            <label>${theRow.fieldName}</label>
                                            <input type="text" class="form-control form-control-user" id="inp-${theRow.fieldName}" aria-describedby="emailHelp" placeholder="Enter ${theRow.fieldName}" value="${theRow.fieldValue}">
                                            </div>`
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
    xhrcall(1, `${apiUrl}projectdata/?projectId=&projectDataId=${window.localStorage.currentDataItemId}`, "", "json", "", xhrDone, token)
})


document.getElementById('btn-edit').addEventListener('click', function() {
    //hold the update data
    let updateData = [];
    //loop through the results
    for (var i = 0; i < results.data.length; ++i) {
        //get the row
        let theRow = results.data[i];
        //check it is used
        if (theRow.isUsed == 1) {
            //get the input
            inpValue = document.getElementById("inp-" + theRow.fieldName).value;
            //build the object
            const data = {};
            data[theRow.fieldName] = inpValue;
            data.id = theRow.id
            //add it to the array
            updateData.push(data);
        }
    }

    //build the payload
    let bodyobj = {
        data: updateData,
        projectid: project.id,
    }
    var bodyobjectjson = JSON.stringify(bodyobj);

    //process the XHR call
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1);
    }
    
    //call the API
    xhrcall(4, `${apiUrl}projectdata/`, bodyobjectjson, "json", "", xhrDone, token)
})
/*

when you update, refresh the form (chnage the label)
*/

/*
let newfields;
let fields;
let originalfields;
let projectid;
let project;
*/

let project = JSON.parse(window.localStorage.currentDataItem);

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {


    let xhrDone = (res) => {
        //set at input variable
        let inpHtml = "";
        //prcess the results
        results = JSON.parse(res);
        //check there is a schema
        if (results.schema.length == 0) {
            showAlert(`No schema for this project, click here to import <a href="/project/data/import/data/?projectid=${project.id}">data</a>`, 2, 0)
            document.getElementById('btn-edit').classList.add('d-none');
            document.getElementById('originalschema').classList.add('d-none');
        } else {
            //set a field var
            let orgFields = "";
            //loop through the schema
            for (var i = 0; i < results.schema.length; ++i) {
                //get the schema row
                const theSchemaRow = results.schema[i];
                //build the label
                let tmpmessage = `unused field ${theSchemaRow.originalFieldName} from  the imported data`;
                //add the field names to the header
                if (orgFields == "")
                    orgFields = theSchemaRow.originalFieldName;
                else
                    orgFields = orgFields + ',' + theSchemaRow.originalFieldName
                //check if the field is being used
                if (theSchemaRow.isUsed == 1) {
                    tmpvalue = theSchemaRow.fieldName;
                    tmpmessage = `Schema field ${i+1} (original name ${theSchemaRow.originalFieldName})`
                }
                //build the input element
                inpHtml = inpHtml + `<div class="form-group" >
                                        <label>${tmpmessage}</label>
                                        <input type="text" class="form-control form-control-user" id="inp-${theSchemaRow.originalFieldName}" aria-describedby="emailHelp" placeholder="Enter ${theSchemaRow.originalFieldName} " value="${tmpvalue}"></div>`


            }
            //show the header
            document.getElementById('originalschema').innerHTML = `Leave fields blank to remove<br>all Fields in the schema ${orgFields}`;
            //set the form elements
            document.getElementById('formInputs').innerHTML = inpHtml
            //show the body
            document.getElementById('showBody').classList.remove('d-none');
        }



    }
    //make the call.
    xhrcall(1, `${apiUrl}projectdata/?projectId=${project.id}`, "", "json", "", xhrDone, token)


})

document.getElementById('btn-edit').addEventListener('click', function() {
    //done function
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1);

    }
    //set an inp value
    let inpValue = "";
    //loop through the schema
    for (var i = 0; i < results.schema.length; ++i) {
        //get the element value
        tmpvalue = document.getElementById("inp-" + results.schema[i].originalFieldName).value;
        //set it
        if (tmpvalue == "") {
            results.schema[i].isUsed = 0;
        } else {
            results.schema[i].fieldName = tmpvalue;
        }

    }
    //build the payload
    let bodyobj = {
        schema: results.schema,
        id: project.id
    }
    //string it
    var bodyobjectjson = JSON.stringify(bodyobj);
    //pass it to the API
    xhrcall(4, `${apiUrl}schema/`, bodyobjectjson, "json", "", xhrDone, token);

})
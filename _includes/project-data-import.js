let projectid;
let importeddata;    
let theTemplate;
let theSchema;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let mergeData = () => {
    //confirmation 
    $('#confirmation-import-modal').modal('toggle')
}


//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            window.location.href = `/project/data/import/data/?projectid=${projectid}`
            break;
        case "2":
            mergeData();
            break;
        case "3":
            window.location.href = `/project/data/import/schema/?projectid=${projectid}`
            break;
        case "4":
            goBack()
            break;
        case "2":
            mergeData();
            break;
        default:
            // code block
    }
    this.value = 0;

})


whenDocumentReady(isReady = () => {
    let urlParam = getUrlParamater('projectid')
    if (urlParam != '') {
        projectid = urlParam;
    } else
        showAlert('Project not found', 2);

    //get the imported data


    let xhrDone = (res) => {
        res = JSON.parse(res)
        importeddata = res;
        //console.log(res);

        if (res.meta.pagination.total == 0) {
            showAlert(`No data imported for this project import data <a href="/project/data/import/data/?projectid=${projectid}">here</a>`, 1, 0)
            document.getElementById('importeddatatable').classList.add("d-none")
        } else {
            document.getElementById('showBody').classList.remove('d-none');
            renderTable(res, 0, 4, [0, 0, 0, 1], 'backpage-data-imports')
        }
    }
    //call the create account endpoint
    xhrcall(1, "backpage-data-imports", "", "json", "", xhrDone, token)

})

document.getElementById('confirmation-modal-import-button').addEventListener('click', function() {

    //alert(deleteId)
    //alert(deleteMethod)
    $('#confirmation-import-modal').modal('toggle')
    $('#import-modal').modal('toggle')
    let message = document.getElementById('mergingmessage')
    //get schema
    message.innerHTML = "Fetching schema and template"
    let xhrDone = (res) => {
        res = JSON.parse(res)
        //console.log(res)
        theSchema = res.data.attributes.schema;
        //theTemplate = res.data.attributes.template;
        //console.log(theSchema);

        fields = theSchema.fields.split(',')
        originalfields = theSchema.originalfields.split(',')
        console.log(fields)
        //delete existing data
        message.innerHTML = "Deleting existing items"
        let xhrDone2 = (res2) => {
            res2 = JSON.parse(res2)

            let xhrDone3 = (res3) => {
                //console.log('record deleted')
            }
            //console.log(res2)
            for (var i = 0; i < res2.data.length; ++i) {
                //console.log(res2.data[i].id)
                xhrcall(3, `backpages/${res2.data[i].id}`, "", "json", "", xhrDone3, token)
            }
            message.innerHTML = "Getting import data"
            //for some reason the actions is being added to this do idea why

            //console.log(importeddata)
            for (var i = 0; i < importeddata.data.length; ++i) {
                //console.log(importeddata.data[i].attributes.data);
                let tmpObj = importeddata.data[i].attributes.data;
                //delete it as it added it for some reason
                delete tmpObj.actions;
                //console.log(tmpObj)
                //build the object to add 
                let xhrDone4 = (res2) => {
                    //console.log('record added')
                }

                for (var f = 0; f < fields.length; ++f) {
                   if (fields[f] == "UNUSED")
                    {
                        console.log(fields[f])
                        console.log(originalfields[f])
                        delete tmpObj[originalfields[f]];
                    }

                }
                let bodyobj = {
                    user: 1,
                    data: {
                        data: tmpObj
                    }
                }
                var bodyobjectjson = JSON.stringify(bodyobj);
                xhrcall(0, `backpages/`, bodyobjectjson, "json", "", xhrDone4, token)
            }
            message.innerHTML = "Import Complete"
        }
        xhrcall(1, "backpages/", "", "json", "", xhrDone2, token)
        
    }
    xhrcall(1, `backpage-projects/${projectid}/`, "", "json", "", xhrDone, token)





    //merge it

    //insert into data table

})
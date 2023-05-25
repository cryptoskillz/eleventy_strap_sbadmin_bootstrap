//add a ready function

/*
todo

show a preview of the data before uploading
allow them to import aagin
*/
let project = JSON.parse(window.localStorage.currentDataItem);

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    $("#csv-file").change(handleFileSelect);
    document.getElementById('showBody').classList.remove('d-none')
    function handleFileSelect(evt) {
        var file = evt.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                //update the fields
                let xhrDone = (res) => {
                    res = JSON.parse(res)
                    //console.log(res);
                    document.getElementById('uploadfile').classList.add('d-none')
                    showAlert(res.message, 1, 0);
                    //update local schema 
                    //project.schema.fields = results.meta.fields.toString()
                    //project.schema.originalfields = results.meta.fields.toString();

                }
                let fields = { fields: results.meta.fields.toString(), originalfields: results.meta.fields.toString() }
                let bodyobj = {
                    projectId: project.id,
                    fields: fields,
                    data: results.data
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //send it
                xhrcall(0, `${apiUrl}projectdataimport/`, bodyobjectjson, "json", "", xhrDone, token)

            }
        });
    }

})
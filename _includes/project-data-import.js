//add a ready function

/*
todo

show a preview of the data before uploading
allow them to import aagin
*/

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {

    //get the project id
    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        $("#csv-file").change(handleFileSelect);
        //console.log(project)
        project = JSON.parse(project)
        //console.log(project)
        document.getElementById('showBody').classList.remove('d-none')

        function handleFileSelect(evt) {
            var file = evt.target.files[0];
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log(results)
                    /*
                    if (results.errors.length > 0) {
                        for (var i = 0; i < results.errors.length; ++i) {
                            console.log(results.errors[i].row)
                            delete results.data[results.errors[i].row]
                        }

                    }
                    */
                    let fields = { fields: results.meta.fields, originalfields: results.meta.fields }
                    let bodyobj = {
                        id: project.id,
                        fields: fields,
                        data: results.data
                    }

                    //update the fields

                    let xhrDone = (res) => {
                        res = JSON.parse(res)
                        //console.log(res)
                        let tmp;
                        tmp = results.meta.fields.toString();

                        project.schema.originalfields = tmp
                        project.schema.fields = tmp
                        //console.log(project)
                        window.localStorage.project = JSON.stringify(project);
                        document.getElementById('uploadfile').classList.add('d-none')
                        //console.log(project)
                        showAlert(res.message, 2, 0)
                    }
                    ///string it 
                    var bodyobjectjson = JSON.stringify(bodyobj);
                    //console.log(bodyobjectjson)
                    //send it to strapi
                    xhrcall(0, `api/projectdataimport/`, bodyobjectjson, "json", "", xhrDone, token)

                }
            });
        }
    }

})
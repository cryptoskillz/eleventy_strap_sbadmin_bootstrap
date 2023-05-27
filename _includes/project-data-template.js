/*
    todo : render the unused fields better

*/
//build a default template incase the user has not created one.
let html5layout = `<DOCTYPE! html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Basic html layout example</title>
</head>
<body class="hello">
  <header>
    <h1></h1>
  </header>
  <nav>
  </nav>
  <section>
    <header>Hello, friend as you have not yet added a template to this project we created this an example of how cool your backpage could look.</header>
    <article>
     [[ELEMENTS]]
    </article>
    <footer>@ whoever</footer>
  </section>
  <aside>
  </aside>
  <footer>
  </footer>
</body>
</html>`
//get the project
let project = JSON.parse(window.localStorage.currentDataItem);
//set up code mirror var
var myCodeMirror;
//set a delay var
var delay;
//let project;
//set a results var
let results;

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//add the key to the html template
let setKey = (theKey) => {
    //get the cursor position
    var cursor = myCodeMirror.getCursor();
    //add the formatting it make it work with nunjucks
    let param = `\{\{${theKey}\}\}`;
    //buil a poistion json
    var pos = {
        line: cursor.line,
        ch: cursor.ch
    }
    //add the paramater
    myCodeMirror.replaceRange(param, pos);
}

whenDocumentReady(isReady = () => {
    console.log(project)
    //check it exists
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);

    //done function
    let xhrDone = (res) => {
        //define some element vars
        let elements2 = "";
        let elements = "";

        //set at input variable
        let inpHtml = "";
        //prcess the results
        results = JSON.parse(res);
        //check we have some 
        if ((results.length != 0) && (results != "") && (results != null)) {
            //loop through them
            for (var i = 0; i < results.schema.length; ++i) {
                //get the row
                let theRow = results.schema[i];
                //loop through the fields
                if (theRow.isUsed == 0) {
                    //add the not used element
                    elements2 = elements2 + `<a href="javascript:setKey('${theRow.fieldName}')">${theRow.fieldName}</a> (not used in template)<br>`
                } else {
                    //add the element
                    elements = elements + `\{\{${theRow.fieldName}\}\}<br>`;
                    //build the insert list of elements
                    elements2 = elements2 + `<a href="javascript:setKey('${theRow.fieldName}')">${theRow.fieldName}</a><br>`
                }
            }
        }
        //check we have some data
        if (results.data.length == 0) {
            showAlert(`No data has been added for this project, no schema generated to add some click <a href="/project/data/import/">here</a>`, 1, 0)
        } else {
            //render the elements
            document.getElementById("projectkeys").innerHTML = "Variables: <br>" + elements2;
        }
        //render the template name
        document.getElementById('inp-template-name').value = results.template.name;
        //get the template code
        let theCode = results.template.template;
        //debug
        //theCode = "";
        //check if there has been a template added
        if ((theCode == null) || (theCode == "")) {
            //set the default
            theCode = html5layout
            //parse the elements
            theCode = theCode.replace("[[ELEMENTS]]", elements);
            //add the create button
            document.getElementById("btn-template").innerHTML = "Create"
        } else {
            //add the update button
            document.getElementById("btn-template").innerHTML = "Update"
        }
        //build the text area
        let textArea = document.getElementById('inp-projectemplate');
        //set up code mirror
        myCodeMirror = CodeMirror.fromTextArea(textArea, {
            mode: 'text/html',
            theme: 'monokai'
        });
        myCodeMirror.setSize(null, 700);

        myCodeMirror.on("change", function() {
            clearTimeout(delay);
            delay = setTimeout(updatePreview, 300);
        });
        myCodeMirror.getDoc().setValue(theCode);
        myCodeMirror.refresh();
        //show it
        document.getElementById('showBody').classList.remove('d-none');
        updatePreview()
        //set the timer
        setTimeout(updatePreview, 300);
    }


    //make the call.
    xhrcall(1, `${apiUrl}projectdata/?projectId=${project.id}&getTemplate=1&projectDataId=`, "", "json", "", xhrDone, token);
})

function updatePreview() {
    var previewFrame = document.getElementById('preview');
    var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(myCodeMirror.getValue());
    preview.close();
}
//setTimeout(updatePreview, 300);


document.getElementById('btn-template').addEventListener('click', function() {

    let template = myCodeMirror.getValue()
    let templatename = document.getElementById('inp-template-name');
    let errorMesage;
    let valid = 1;
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        //show the message
        showAlert(res.message, 1);
        //update the template info locally
        results.template.name = templatename.value;
        results.template.template = template;
        //change the button if it was in create stage
        if (document.getElementById("btn-template").innerHTML == "Create")
            document.getElementById("btn-template").innerHTML = "Update"

    }

    //check we have a template name
    if (templatename.value == "") {
        errorMesage = "Template name cannot be blank"
        valid = 0;
    }
    //check we have a template
    if (template == "") {
        errorMesage = "Template cannot be blank"
        valid = 0;
    }
    //check it is valid
    if (valid == 1) {
        //rest the valid flag
        valid = 0;
        //build the json object
        let bodyobj = {
            template: template,
            templateName: templatename.value,
            projectId: project.id
        }
        //turn it into a string
        var bodyobjectjson = JSON.stringify(bodyobj);
        //make the call
        xhrcall(4, `${apiUrl}template/`, bodyobjectjson, "json", "", xhrDone, token)
    } else
        showAlert(errorMesage, 2)

});

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    //check what was selected
    switch (this.value) {
        case "1":
            //set a valid flag
            let valid = 1
            //check we have some data
            if (results.data.length == 0) {
                showAlert(`Unable to view template as no data has been added to add some click <a href="/project/data/import/">here</a>`, 2)
                valid = 0;
            }
            //check we have a template
            if ((results.template.template == "") || (results.template.template == null)) {
                showAlert(`Please save the template to view it`, 2)
                valid = 0;

            }
            //check its valid and open the template viewer
            if (valid == 1) {
                window.open(`/project/template/view/`, '_blank');
            }

            break;
        case "2":
            //go back
            window.location.href = `/project/data/`
            break;

        default:
            // code block
    }
    this.value = 0;

})
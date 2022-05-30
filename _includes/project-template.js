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
    <header>Hello, friend this an example of how cool your backpage could look.</header>
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

let projectid = 0;

var myCodeMirror;
var delay;

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
    //check for a paramater.
    let urlParam = getUrlParamater('projectid')
    //check if it is black
    if (urlParam != "") {
        //set the project id
        projectid = urlParam;
        //done function
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            let fields = res.data[0].schema.fields
            //debug 
            let keys = []
            if (fields != "")
                keys = fields.split(",");

            let elements2 = "";
            let elements = "";

            /*
            if (keys.length == 0)
            {
                keys.push('var 1')
                keys.push('var 2')
            }
            */


            for (var i = 0; i < keys.length; ++i) {
                //console.log(keys[i])
                elements = elements + `\{\{${keys[i]}\}\}<br>`
                elements2 = elements2 + `<a href="javascript:setKey('${keys[i]}')">${keys[i]}</a><br>`
            }

            //console.log(elements)
            //console.log(elements2)

            if (keys.length == 0) {
                document.getElementById("projectkeys").innerHTML = "No data has been added for this project";
            } else {
                document.getElementById("projectkeys").innerHTML = "Variables: <br>" + elements2;
            }

            if ((res.data[0].templatename != "") && (res.data[0].templatename != null)) {
                let templatename = document.getElementById('inp-template-name');
                templatename.value = res.data[0].templatename;
            }
            let theCode = res.data[0].template;
            if ((theCode == null) || (theCode == "")) {
                theCode = html5layout
                theCode = theCode.replace("[[ELEMENTS]]", elements);
                document.getElementById("btn-template").innerHTML = "Create"
            } else {
                document.getElementById("btn-template").innerHTML = "Update"
            }

            let textArea = document.getElementById('inp-projectemplate');
            document.getElementById("showBody").classList.remove("d-none")



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

        }


        if (urlParam != "") {

            //get the data so we can get the keys for the elements
            document.getElementById('showBody').classList.remove('d-none')
            xhrcall(1, `api/projects/?id=${projectid}`, "", "json", "", xhrDone, token)
        } else {
            //no project id so show an error.
            showAlert("project not found", 2, 0)
        }


    } else {
        //no project id so show an error.
        showAlert("project not found", 2, 0)

    }
})

function updatePreview() {
    var previewFrame = document.getElementById('preview');
    var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(myCodeMirror.getValue());
    preview.close();
}
setTimeout(updatePreview, 300);

document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            //check if it is black
            if (projectid != "") {
                let href = `/project/template/view/?projectid=${projectid}`
                window.open(
                    href,
                    '_blank' // <- This is what makes it open in a new window.
                );
            }
            break;
        case "2":
            // code block
            window.location.href = "/projects/"
            window.location.target = "_blank"
            break;
        default:
            // code block
    }
    //reset the dropdown


})


document.getElementById('btn-template').addEventListener('click', function() {
    let template = myCodeMirror.getValue()
    let templatename = document.getElementById('inp-template-name');
    let valid = 1;
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert("project template has been updated", 1)

    }

    let errorMesage;

    if (templatename.value == "") {
        errorMesage = "Template name cannot be blank"
        valid = 0;
    }

    if (template == "") {
        errorMesage = "Template cannot be blank"
        valid = 0;
    }

    if (valid == 1) {
        valid = 0;

        let bodyobj = {
            template: template,
            templatename: templatename.value,
            id: projectid
        }

        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(4, `api/projects/`, bodyobjectjson, "json", "", xhrDone, token)
    } else
        showAlert(errorMesage, 2)

});
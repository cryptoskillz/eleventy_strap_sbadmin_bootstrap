/*
when we have done the data import we have to rebuild this


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
        //check we have some 
        if ((results.length != 0) && (results != "") && (results != null)) {
            //get the first row of data
            let theData = results.data;
            //make sure we have data and someone is not trying to be naughty
            if (theData != undefined) {
                //loop through the data
                for (var i = 0; i < theData.length; ++i) {
                    //check for a template
                    if (results.template.template != "") {
                        //process the fields
                        //note we could check for is used here to speed things up a little
                        let theElement = `\{\{${theData[i].fieldName}\}\}`
                        //update the template
                        results.template.template = results.template.template.replace(theElement, theData[i].fieldValue);
                    } else {
                        //we dont have a teplate
                        results.template.template = "No template added for this project"

                    }
                }
            } else {
                //we dont have data
                results.template.template = "No data added for this project"
            }
            //wrtie it out to the dom
            document.open();
            document.write(results.template.template);
            document.close();
        }

    }
    //make the call.
    xhrcall(1, `${apiUrl}projectdata/?projectId=&getTemplate=1&projectDataId=${window.localStorage.currentDataItemId}`, "", "json", "", xhrDone, token);
})
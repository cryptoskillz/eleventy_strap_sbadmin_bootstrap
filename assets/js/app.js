let redirectUrl = ""; // hold the redcirect URL
let token;
let user;
let checkElement
var table // datatable
//TODO: replace this with plain js
(function($) {
    "use strict"; // Start of use strictß

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };

        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });

})(jQuery); // End of use strict


/*
START OF TABLE FUNCTIONS


*/


let deleteId = 0;
let tableRowId = 0;
let deleteMethod = "";

checkElement = document.getElementById("confirmation-modal-delete-button");

if (typeof(checkElement) != 'undefined' && checkElement != null) {
    document.getElementById('confirmation-modal-delete-button').addEventListener('click', function() {
        $('#confirmation-modal').modal('toggle')
        let xhrDone = (res) => {
            //parse the response
            showAlert('Item has been deleted', 1)
            table.row('#' + tableRowId).remove().draw();

        }
        let project = window.localStorage.project
        project = JSON.parse(project)
        let bodyobj = {
            id: deleteId,
            projectid: project.id
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the create account endpoint
        xhrcall(3, `${deleteMethod}/`, bodyobjectjson, "json", "", xhrDone, token)

    })
}


let deleteTableItem = (dId, tId, method) => {
    deleteId = dId;
    tableRowId = tId;
    console.log(tableRowId);
    deleteMethod = method;
    $('#confirmation-modal').modal('toggle')
}



//table render
let renderTable = (data, actions = [], method = "") => {
    /*actions
        0 = delete button

        remove the weird id rendering as we will alwasy haev an id now
        store the table data
    */
    //set some array

    //get the project
    let project = window.localStorage.project
    project = JSON.parse(project)
    //set the arrays for the table
    let columns = []
    let dataresult = []
    //get the keys from the schema and move into an array
    var keys = project.schema.fields.split(",")

    //loop through the keys and build the columns
    for (var i = 0; i < keys.length; ++i) {
        colJson = { title: keys[i] }
        //add it it the columns object
        columns.push(colJson)
    }

    //add the actions column
    if (actions.length != 0) {
        columns.push({ title: "actions" })
    }


    let tableRowCount = 0;

    //check for the first column with a number to set as the ids for row deletion in the table
    let foundIt = 0
    let tmpd = Object.values(data.data[0].data)
    for (var i = 0; i < tmpd.length; ++i) {
        if ((!isNaN(tmpd[i]) && foundIt == 0)) {
            foundIt = 1;
            tableRowCount = i
        }

    }
    //loop through the data
    for (var i = 0; i < data.data.length; ++i) {

        //pull out the values and store in the array
        let tmp = data.data[i].data;
        //the field values
        let tableId;
        tableId = Object.values(tmp)


        //tableDeleteId =data.data[i].bpid
        if (actions.length != 0) {
            let buttons = "";

            //edit button
            if (actions[0] == 1)
                buttons = buttons + `<a href="/project/data/edit/?id=${data.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            //publish button
            if (actions[1] == 1)
                buttons = buttons + `<a href="/project/data/?id=${data.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>`
            //view button
            if (actions[2] == 1)
                buttons = buttons + `<a target="_blank" href="/project/template/view/?dataid=${data.data[i].id}&projectid=${project.id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50" ></i> View</a>`
            //delete button
            if (actions[3] == 1)
                buttons = buttons + `<a href="javascript:deleteTableItem('${data.data[i].id}','${tableId[tableRowCount]}','${method}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
            tmp.actions = buttons;
        }
        //console.log(tmp)
        dataresult.push(Object.values(tmp))
    }
    //render the table
    //console.log(dataresult)
    table = $('#dataTable').DataTable({
        data: dataresult,
        rowId: tableRowCount,
        columns: columns,

    });


}

/*
END OF TABLE FUNCTIONS
*/

//this fucntion validates an email address.
let validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

let goBack = () => {
    history.back();
}

let showAlert = (message, alertType, timeoutBool = 1) => {
    let alertEl;
    //set the alert type
    if (alertType == 1)
        alertEl = document.getElementById('accountsSuccess');
    if (alertType == 2)
        alertEl = document.getElementById('accountsDanger');
    //set the message
    alertEl.innerHTML = message
    //remove the class
    alertEl.classList.remove('d-none');
    //clear it after 5 seconds
    if (timeoutBool == 1)
        alertTimeout = setTimeout(function() { alertEl.classList.add('d-none') }, 5000);


}

/* 

start of global account stuff

Ideally this should live in accounts.js but seeing as require it on every page we put it here instead otherwise we would have
to include accounts.js and app.js in every page

*/

let getToken = () => {
    token = window.localStorage.token;
    if ((token != "") && (token != undefined)) {
        return (token);
    } else {
        return ("")
    }
}


let logout = () => {
    alert('to do logout')
}


let checkLogin = () => {
    //check if it is not a login page
    if ((window.location.pathname == "/create-account/") || (window.location.pathname == "/login/") || (window.location.pathname == "/forgot-password/")) {
        //window.location = '/'
    } else {
        //get the user object
        let tmpUser = window.localStorage.user
        //check it exists
        if (tmpUser != undefined) {
            //decode the json
            user = JSON.parse(window.localStorage.user);
            //check the user is logged in some one could spoof this so we could do a valid jwt check here 
            //but i prefer to do it when we ping the api for the data for this user. 
            if (user.loggedin != 1) {
                window.location = '/login'
            } else {
                //set the jwt and user
                getToken();
                checkElement = document.getElementById("user-account-header");
                if (typeof(checkElement) != 'undefined' && checkElement != null) {
                    if ((user.username != "") && (user.username != undefined))
                        document.getElementById('user-account-header').innerHTML = user.username
                    else
                        document.getElementById('user-account-header').innerHTML = user.email
                }
            }
        } else {
            window.location = '/login'
        }

    }
}


/* 

end of global account stuff

*/


let getUrlParamater = (param) => {
    let searchParams = new URLSearchParams(window.location.search)
    let res = searchParams.has(param) // true
    if (res != false)
        return (searchParams.get(param))
    else
        return ("");

}



//this function makes the XHR calls.
let xhrcall = (type = 1, method, bodyObj = "", setHeader = "", redirectUrl = "", callback = '', auth = "") => {
    //debug
    //console.log(apiUrl)
    //console.log(bodyObj)
    //console.log(method)
    //console.log(callback)

    /*
      Note if we are not using strai and have a custom URL we can change it here like wise if we want to use 2 we can check the method to select the correct base url
    */

    checkElement = document.getElementById("spinner");

    if (typeof(checkElement) != 'undefined' && checkElement != null) {
        document.getElementById("spinner").classList.remove("d-none");
    }
    let url = apiUrl + method;
    //store the type
    let xhrtype = '';
    switch (type) {
        case 0:
            xhrtype = 'POST';
            break;
        case 1:
            xhrtype = 'GET';
            break;
        case 2:
            xhrtype = 'PATCH';
            break;
        case 3:
            xhrtype = 'DELETE';
            break;
        case 4:
            xhrtype = 'PUT';
            break;
        default:
            xhrtype = 'GET';
            break;
    }

    //set the new http request
    let xhr = new XMLHttpRequest();
    xhr.open(xhrtype, url);

    //set the header if required
    //note (chris) this may have to be a switch
    if (setHeader == "json")
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (auth != "")
        xhr.setRequestHeader("Authorization", "Bearer " + auth);
    //send the body object if one was passed
    if (bodyObj !== '') {
        xhr.send(bodyObj);
    } else {
        xhr.send();
    }
    //result
    //todo (chris) make this eval back to a done function
    xhr.onload = function() {
        checkElement = document.getElementById("confirmation-modal-delete-button");

        if (typeof(checkElement) != 'undefined' && checkElement != null) {
            document.getElementById("spinner").classList.add("d-none");
        }
        //check if its an error
        let res = xhr.response;
        let errorMessage = "";

        //check for errors
        if ((xhr.status == 400) || (xhr.status == 403) || (xhr.status == 500)) {
            //process the response
            res = JSON.parse(res)
            errorMessage = res.error
            if (errorMessage == "")
                errorMessage = "Server Error"
        }
        if (xhr.status == 405) {
            errorMessage = res
        }

        if (xhr.status == 205) {
            errorMessage = res
        }

        if (errorMessage != "") {
            showAlert(errorMessage, 2)
        }


        //check if it was ok.
        if (xhr.status == 200) {
            //check if a redirecr url as passed.
            if (redirectUrl != "") {
                window.location = redirectUrl
            } else {
                //console.log(res)
                //res = JSON.parse(res)
                //console.log(res)
                eval(callback(res));
            }

        }

    }
};

checkLogin()
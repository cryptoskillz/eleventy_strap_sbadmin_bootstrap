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
        //alert(deleteId)
        //alert(deleteMethod)
        $('#confirmation-modal').modal('toggle')
        let xhrDone = (res) => {
            //parse the response
            showAlert('Item has been deleted',1)
            table.row('#' + tableRowId).remove().draw();

        }

        //call the create account endpoint
        //todo : Pass in the user object, you would think Strapi would pick this up from the token but for reason the do not.     var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(3, `${deleteMethod}/${deleteId}/`, "", "json", "", xhrDone, token)

    })
}


let deleteTableItem = (dId, tId, method) => {
    deleteId = dId;
    tableRowId = tId;
    deleteMethod = method;
    $('#confirmation-modal').modal('toggle')
}



//table render
//note : depereciate row id
let renderTable = (data, addId = 0, rowId = "", actions = [], method = "") => {
    /*actions
        0 = delete button
    */
    //console.log(data);
    //set some array
    let columns = []
    let dataresult = []
    let idTableRow;
    //get the keys
    var keys = Object.keys(data.data[0].attributes.data);
    //loop through the keys
    for (var i = 0; i < keys.length; ++i) {
        //build the column
        if(keys[i] == "id")
            idTableRow = i 
        colJson = { title: keys[i] }
        //add it it the columns object
        columns.push(colJson)
    }
    if (addId == 1) {
        columns.push({ title: "id" })
        idTableRow = columns.length - 1

    }
    if (actions.length != 0) {
        columns.push({ title: "actions" })
    }

    /*
    if (rowId != "")
    {
        idTableRow = rowId
    }
    */
    //console.log(rowId)
    //check if row id is still blank and look for it in the data

    //loop through the data
    for (var i = 0; i < data.data.length; ++i) {
        //pull out the values and store in the array
        //console.log(data.data[i])
        let tmp = data.data[i].attributes.data;
        //console.log(tmp)
        let recordId;
        let tableDeleteId;

        if (addId == 1) {
            recordId = data.data[i].id
            tableDeleteId = data.data[i].id
            tmp.id = recordId
        }
        else
        {
            recordId = data.data[i].id
            //console.log(tmp)
            tableDeleteId = tmp.id
            
        }
        //console.log(tmp)
        if (actions.length != 0) {
            let buttons = "";

            //edit button
            if (actions[0] == 1)
                buttons = buttons + `<a href="/project/data/edit/?id=${recordId}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            //publish button
            if (actions[1] == 1)
                buttons = buttons + `<a href="/project/data/?id=${recordId}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>`
            //view button
            if (actions[2] == 1)
                buttons = buttons + `<a target="_blank" href="/project/template/view/?dataid=${recordId}&projectid=${projectid}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50" ></i> View</a>`
            //delete button
            if (actions[3] == 1)
                buttons = buttons + `<a href="javascript:deleteTableItem(${recordId},'${tableDeleteId}','${method}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`



            tmp.actions = buttons;
        }
        //console.log(tmp)
        dataresult.push(Object.values(tmp))
    }
    //render the table
    table = $('#dataTable').DataTable({
        data: dataresult,
        rowId: idTableRow,
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
            errorMessage = res.error.message
        }
        if (xhr.status == 405) {
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
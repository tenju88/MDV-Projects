$('#home').on('pageinit', function() {
    //code needed for home page goes here
});

$('#addmem').on('pageinit', function() {

    //    Set Link & Submit Click Events
    var displayLink = $('#displayLink');
    displayLink.on("click", getData);
    var clearLink = $('#clear');
    clearLink.on("click", clearLocal);
    var save = $('#submit');
    save.on("click", storeData);

    //any other code needed for addItem page goes here
    var validate = function() {
        console.log('made it');
        var mform = $('#addmemform');
        mform.validate({
            invalidHandler: function(form, validator) {},
            submitHandler: function() {
                var data = mform.serializeArray();
                storeData(data);
            }
        });
    };

    function storeData(data) {
        console.log('storeData');
		var id = Math.floor(Math.random() * 1000001);
        if (!data.key) {
        } else {
            id = key;
        }
        var item = {};
        item.title = ["Title: ", $('#title').val()];
        item.fname = ["First Name: ", $('#fname').val()];
        item.lname = ["Last Name: ", $('#lname').val()];
        item.bday = ["Birthday: ", $('#bday').val()];
        item.ddate = ["Death date: ", $('#ddate').val()];
        item.age = ["Age: ", $('#age').value];
        item.notes = ["Notes: ", $('#notes').value];
        item.fav = ["Save as Favorite: ", favValue];
        item.key = id;
        
        $.couch.db("asdproject").saveDoc(item, {
            success: function(item) {
                console.log(item);
            },
            error: function(status) {
                console.log(status);
            }
        });
        //Save data into Local Storage: Use stringify to convert our object to a string.
        localStorage.setItem(id, JSON.stringify(item));
        alert("Contact Saved!");
      	
    }

    function getData() {
      console.log("getData fires");  
    	$('#familyMembers').empty();
        $.ajax({
            url: "_view/members",
            type: "GET",
            dataType: "json",
            success: function(result) {
            		console.log(result);
            				$.each(result.rows, function(index, member){
            				
                				$(''+
	                						'<li>'+
					                				'<p>'+"Title: "+ member.value.title + '<br />' + '</p>'+
					                				'<p>'+"First Name: "+ member.value.fname + '<br />' + '</p>'+
					                				'<p>'+"Last Name: "+ member.value.lname + '<br />' + '</p>'+
					                				'<p>'+"Birthday: "+ member.value.bday + '<br />' + '</p>'+
					                				'<p>'+"Death Date: "+ member.value.ddate + '<br />' + '</p>'+
					                				'<p>'+"Age: "+ member.value.age + '<br />' + '</p>'+
					                				'<p>'+"Gender: "+ member.value.sex + '<br />' + '</p>'+
					                				'<p >'+"Notes: "+ member.value.notes+ '<br />' + '</p>'+
					                				'<p>'+"Favorite?: "+ member.value.fav + '<br />' + '</p>'+
				                				'</li>'
                					
                				).appendTo("#familyMembers");
                				
               				});
               				$('#familyMembers').listview('refresh');
            },				
            	error: function(data) {}
     	});
    }

    //Get the image for the right catagory
    function getImage(catName, makeSubList) {
        var imageLi = $('li');
        makeSubList.append(imageLi);
        var newImg = $('img');
        var setSrc = newImg.setAttribute("src", "images/tabIcons" + catName + ".png");
        imageLi.append(newImg);
    }

    //JSON Object which will auto populate local storage


    function autoFillData() { 

//        Store the JSON Object into Local Storage
        for (var n in json) {
            var id = Math.floor(Math.random() * 1000001);
            localStorage.setItem(id, JSON.stringify(json[n]));
        }
    }


    //Make Item Links:
    // Create the edit and delete links for each stored item when displayed
    function makeItemLinks(key, linksLi) {
        //add edit single item link
        var editLink = $('a');
        editLink.attr("href", "#addmemform");
        editLink.key = key;
        var editText = "Edit Member";
        editLink.addClass("editLink").on("click", editItem).html(editText);
        linksLi.append(editLink);
        var space = $('<br/>');
        linksLi.append(space);
        //add delete single item link
        var deleteLink = $('a');
        deleteLink.attr("href", "#");
        deleteLink.key = key;
        var deleteText = "Delete Member";
        deleteLink.addClass("deleteLink").on("click", deleteItem).html(deleteText);
        linksLi.append(deleteLink);
    }

    function editItem() {
        //grab the data from our local storage
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);
        //show the form        
        //        toggleControls('off');
        //populate the form fields with current localStorage values
        $('#title').val(item.title[1]);
        $('#fname').val(item.fname[1]);
        $('#lname').val(item.lname[1]);
        $('#bday').val(item.bday[1]);
        $('#ddate').val(item.ddate[1]);
        $('#age').val(item.age[1]);
        $('#notes').val(item.notes[1]);
        //    ge("number").innerHTML = item.age[1] + " yrs";
        //        var radios = document.forms[0].sex;
        //        console.log(radios);
        //        for(var i=0; i<radios.length; i++){
        //            if(radios[i].value === item.sex[1]){
        //                radios[i].setAttribute("checked", "checked");
        //            }
        //        }
        if (item.fav[1] == "Yes") {
            $('#fav').attr("checked", "checked");
        }

        //Remove the initial listener from the input ' save contact ' button.
        editSubmit.off("click", storeData);
        // Change Submit Button Value to edit button
        $("#submit").val("Edit Member");
        var editSubmit = $("submit");
        // Save the key value established  in the this function as a property of the editSubmit event
        //so we can use that value when we save the data we edited.
        editSubmit.on("click", storeData);
        editSubmit.key = this.key;

    }

    function deleteItem() {
    	var doc = {
    		    _id: "d12ee5ea1df6baa2b06451f44a019ab9",
    		    _rev: "2-13839535feb250d3d8290998b8af17c3"
    		};
    		$.couch.db("asdproject").removeDoc(doc, {
    		     success: function(data) {
    		         console.log(data);
    		    },
    		    error: function(status) {
    		        console.log(status);
    		    }
    		});
    }

    	
    function clearLocal() {
        if (localStorage.length === 0) {
            alert("There is no data to clear!");
        } else {
            localStorage.clear();
            alert("All members deleted!");
            window.location.reload();
            return false;
        }
    }

    favValue = "No";
    errMsg = $('errors');

    //url functions
    var urlVar = function() {
    	var urlData=$($.mobile.activePage).data("url");
    	var urlParts = urlData.split('?');
    	var urlPairs = urlParts[1].split('&');
    	var urlValues = {};
    	for (var pair in urlPairs) {
    		var keyValue = urlPairs[pair].split('=');
    		var key = decodeURIComponent(keyValue[0]);
    		var value = decodeURIComponent(keyValue[1]);
    		urlValue[key] = value;
    	}
    	return urlValues;
    }
    
    var changePage = function(pageID){
    			$('#' + pageID).trigger('pageinit');
    			$.mobile.changePage($('#' + pageID), {transition: 'fade'});
    
    }
    
}); // #addmem pageinit

    

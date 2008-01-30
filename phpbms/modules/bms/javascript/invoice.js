/*
 $Rev$ | $LastChangedBy$
 $LastChangedDate$
 +-------------------------------------------------------------------------+
 | Copyright (c) 2004 - 2007, Kreotek LLC                                  |
 | All rights reserved.                                                    |
 +-------------------------------------------------------------------------+
 |                                                                         |
 | Redistribution and use in source and binary forms, with or without      |
 | modification, are permitted provided that the following conditions are  |
 | met:                                                                    |
 |                                                                         |
 | - Redistributions of source code must retain the above copyright        |
 |   notice, this list of conditions and the following disclaimer.         |
 |                                                                         |
 | - Redistributions in binary form must reproduce the above copyright     |
 |   notice, this list of conditions and the following disclaimer in the   |
 |   documentation and/or other materials provided with the distribution.  |
 |                                                                         |
 | - Neither the name of Kreotek LLC nor the names of its contributore may |
 |   be used to endorse or promote products derived from this software     |
 |   without specific prior written permission.                            |
 |                                                                         |
 | THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS     |
 | "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT       |
 | LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A |
 | PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT      |
 | OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,   |
 | SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT        |
 | LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,   |
 | DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY   |
 | THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT     |
 | (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE   |
 | OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.    |
 |                                                                         |
 +-------------------------------------------------------------------------+
*/

// INVOICE CLASS ===================================================
//=================================================================
invoice = {
	
	submitForm: function(e){
							
		var theForm = getObjectFromID("record");
		
		if(!validateForm(theForm)){
			if(e)
				e.stop();
			return false;
		}
		
		//skip validation if cancel
		cancelClick = getObjectFromID("cancelclick");
		if(cancelClick.value !=0)
			return true;		
		
		var readytopost = getObjectFromID("readytopost");
		var amountdue = getObjectFromID("amountdue");
		var payinfull = getObjectFromID("payinfull");
		var totalti = getObjectFromID("totalti");
		var creditleft = getObjectFromID("creditleft");
		var invoicedate = getObjectFromID("invoicedate")
		
		var errorArray = Array();
		if(readytopost.checked && invoicedate.value == "")
			errorArray[errorArray.length] = "Orders marked ready to post must have an invoice date";
		
		if(readytopost.checked && currencyToNumber(amountdue.value)!= 0 && payinfull.style.display != "none")
			errorArray[errorArray.length] = "Orders marked ready to post and not charged to accounts receivable must be paid in full.";
		
		if(payinfull.style.display == "none" && currencyToNumber(creditleft.value) < currencyToNumber(totalti.value))
			errorArray[errorArray.length] = "Orders ammount exceeds credit left. ("+creditleft.value+")";

		if(errorArray.length > 0){
			
			var content = "<p>The following errors were found:</p><ul>";
			
			for(var i=0; i < errorArray.length; i++)
				content += "<li>"+errorArray[i]+"</li>";
			
			content += "</ul>";
			
			alert(content);
			
			if(e)
				e.stop();
			return false;
			
		}//end if

		var lineitemsChanged = getObjectFromID("lineitemschanged");
		if(lineitemsChanged.value ==1)
			lineitems.prepareForPost()

	}, //end method
	
	
	
	updateTotalCost: function(){
		
		var totalCost = getObjectFromID("totalcost");
		
		var newCost = 0;
		
		var items = getElementsByClassName("lineitems")
		var qty, cost;
		
		for(var i = 0; i<items.length; i++){
			
			cost = getObjectFromID(items[i].id + "UnitCost");
			qty = getObjectFromID(items[i].id + "Quantity");

			if( !isNaN(parseFloat(cost.value)) && !isNaN(parseFloat(qty.value)) )	
				newCost += roundForCurrency(parseFloat(cost.value) * parseFloat(qty.value));
			
		}//endfor

		totalCost.value = newCost
		
	},// end function
	
	
	updateTotalWeight: function(){

		var totalWt = getObjectFromID("totalweight");
		
		var newWt = 0;
		
		var items = getElementsByClassName("lineitems")
		var qty, wt;
		
		for(var i = 0; i<items.length; i++){
			
			wt = getObjectFromID(items[i].id + "UnitWeight");
			qty = getObjectFromID(items[i].id + "Quantity");

			if( !isNaN(parseFloat(wt.value)) && !isNaN(parseFloat(qty.value)) )	
				newWt += parseFloat(wt.value) * parseFloat(qty.value);
			
		}//endfor
					
		totalWt.value = newWt;

	},//end function
	
	
	updateTotalTaxable: function(){
		
		var lineitems = getElementsByClassName("lineitems");
		
		var totaltaxable = getObjectFromID("totaltaxable")
		
		var newtaxable = 0;
		
		var taxable, extended
		
		for(var i=0; i<lineitems.length; i++){
			
			taxable = getObjectFromID(lineitems[i].id + "Taxable");
			
			if(taxable.value == 1)
				newtaxable += currencyToNumber(getObjectFromID(lineitems[i].id + "Extended").value);
			
		}//end for
		
		totaltaxable.value = newtaxable;
		
	},//end function
	
	
	updateSubTotal: function(){
		
		var totalBD = getObjectFromID("totalBD");
		
		var lineitemExtendeds = getElementsByClassName("lineitemExtendeds");
		
		var newTBD = 0;
		
		for(var i = 0; i < lineitemExtendeds.length; i++)
			if(lineitemExtendeds[i].value !== "")
				newTBD += currencyToNumber(lineitemExtendeds[i].value);
				
		totalBD.value = newTBD;

	}, //end function
	
		
	doAllTotals: function(){
		
		invoice.updateTotalCost();
		invoice.updateTotalWeight();
		invoice.updateTotalTaxable();
		invoice.updateSubTotal();
		
		calculateTotal();
		
	}//end function
	
}//end class

// STATUS CLASS ===================================================
//=================================================================
theStatus = {

	statusChosen: function(e){
		
		var status=getObjectFromID("statusid");
		var assignedto=getObjectFromID("ds-assignedtoid");

		//update assignedto
		if(statuses[status.value]["firstname"] || statuses[status.value]["lastname"]){
			
			assignedto.value = (statuses[status.value]["firstname"]+" "+statuses[status.value]["lastname"]).replace(/^\s+|\s+$/g,"");
			lastLookup(assignedto);
			
		}//endif
		
		var readytopost = getObjectFromID("readytopost");
		
		if(statuses[status.value]["setreadytopost"] == 1){
			
			var invoicedate = getObjectFromID("invoicedate");
			if(!invoicedate.value)
				invoicedate.value = dateToString(new Date());
			readytopost.checked = true;
			
		} else {
			
			readytopost.checked = false;
			
		}//endif
					
		theStatus.updateDate();
		
	},//end mehtod


	checkRTP: function(e){
		
		var readytopost = getObjectFromID("readytopost")
		
		if(readytopost.checked){
			
			var invoicedate = getObjectFromID("invoicedate");
			if(!invoicedate.value)
				invoicedate.value = dateToString(new Date());
		}//endif
		
	}, //end method


	statusChange: function(e){

		var statuschanged=getObjectFromID("statuschanged");
		statuschanged.value=1;
		
	},//end method
	
	
	updateDate: function(e){
		
		var statusdate=getObjectFromID("statusdate");
		var today=new Date();
		statusdate.value=dateToString(today);
		
		theStatus.statusChange();
	}//end method
	
}//end class


// CLIENT CLASS ===================================================
//=================================================================
client = {

	triggerLookup: false,	
	
	displayValue: "",
	
	committedDisplayValue: "",
	
	searchBox: null,
	
	changeDisplay: function(e){
		
		//this sets the time out to do an ajax lookup when they are done typing their search criteria.
		
		var display = e.src();
		
		if (display.value!=client.displayValue && display.value!=""){
		
			if(client.triggerLookup)
				window.clearTimeout(client.triggerLookup);
			
			client.triggerLookup = window.setTimeout("client.lookup()",250);
			
		} else {
			//it's possible they hit the down, up arrow, or the return button

			var key = e.event().keyCode;

			switch(key){
				
				case 40:
					//move highlight down
					client.moveSearchHighlight("down");
					break;
		
				case 38:
					//move highlight down
					client.moveSearchHighlight("up");
					break;
				
				case 27:
					//cancel
					client.cancelSearch();
				
			}//endswitch

		}//endif
		
	},//end method
	
	
	moveSearchHighlight: function(direction){
		
		var csbResults = getObjectFromID("CSBResults");
		var currentItem = 0
		var classes
		
		if(direction=="down")
			direction = 1;
		else
			direction =-1;
		
		for(var i=0; i < csbResults.childNodes.length; i++){
			
			if(csbResults.childNodes[i].className)
				if(csbResults.childNodes[i].className.indexOf("CSBSelected") !== -1){
					currentItem = i;
					classes = csbResults.childNodes[i].className.split(" ");
					csbResults.childNodes[i].className = classes[0] + " " + classes[1];
				}
							
		}//endfor

		var newItem = currentItem + direction
		
		while(newItem >= 0 && newItem < csbResults.childNodes.length){
			
			if(csbResults.childNodes[newItem].className){
				
				csbResults.childNodes[newItem].className += " CSBSelected";
				newItem = -1000;
				
			}else 
				newItem += direction
				
		}//endwhile
		
	}, //endif
	

	searchResultsConnects: Array(),

	lookup: function(offset){
		
		// We need to do an ajax lookup based on the criteria.
		// Fisrt we need to see if the holding box is visible.
		// if not we need to create it		
		if (!client.searchBox)
			client.createSearchBox();
			

		var csbResults = getObjectFromID("CSBResults");

		if(!offset){
			offset = 0;
			csbResults.style.height="";
		}
			
			
		var closeButton = getObjectFromID("CSBCloseButton");		
		closeButton.className = "graphicButtons buttonSpinner";
		
		var clientdisplay = getObjectFromID("clientdisplay");
		client.displayValue = clientdisplay.value;

		var base = document.URL;
		base = base.substring(0,base.indexOf("invoices_addedit.php"));

		var theurl = base + "invoices_client_ajax.php?w=term&t=" + encodeURI(clientdisplay.value);
		
		if(offset != 0)
			theurl += "&o=" + offset;
		
		for(var i=0; i<client.searchResultsConnects.length; i++)
			disconnect(client.searchResultsConnects[i])

		loadXMLDoc(theurl,null,false);
				
		response = req.responseXML.documentElement;
		
		var numRecords = response.childNodes.length
		
		var totalRecords = response.attributes.getNamedItem("total").value;

		var newText="";		
		var fields;
		var name;
		var loc;

		if(numRecords) {
			for(var i=0; i<numRecords; i++){
				
				fields = {};
				name="";
				loc="";
				
				for(j=0; j < response.childNodes[i].childNodes.length; j++)
					if(response.childNodes[i].childNodes[j].tagName == "field")
						fields[response.childNodes[i].childNodes[j].attributes.getNamedItem("name").value] = response.childNodes[i].childNodes[j].attributes.getNamedItem("value").value;
				
				if(fields["company"]){
					
					name = fields["company"];
					if(fields["lastname"])
						name += ' (' + fields["lastname"] + ', ' + fields["firstname"] + ')';
						
				} else {
					
					name = fields["lastname"] + ', ' + fields["firstname"];
					
				}//endif
				
				if(fields["city"])
					loc += fields["city"];

				if(fields["state"])
					loc += ', ' + fields["state"];

				if(fields["postalcode"])
					loc += ' ' + fields["postalcode"];

				if(fields["country"])
					loc += ' (' + fields["country"] + ')';
					
				if(!loc)
					loc = 'unspecified location';

				newText += '\
					<a href="#" class="CSBSearchItems ' + fields["type"] + '" id="CSB-' + fields["id"] + '" tabindex="4000">\
						<span class="CSBMain">' + name + '</span>\
						<span class="CSBExtra">' + loc + '</span>\
					</a>';

								
			}//endfor
			
			if(offset + numRecords < totalRecords){
				//add more button for searches that have lots of records
				newText += '\
					<div id="CSBMoreDiv">\
						<button type="button" id="CSBmoreButton" class="smallButtons" value="' + (offset + numRecords) + '">more results...</button>\
				</div>';				


			}//end if
			
		} else {
			
			newText = '<div>No Clients or Prospects Found Matching Criteria</div>';
			
		}//endif
			
		if(!offset)
			csbResults.innerHTML = newText;
		else
			csbResults.innerHTML += newText;
		
		var searchItems = getElementsByClassName("CSBSearchItems");
		client.searchResultsConnects = Array();
		
		for(i=0; i < searchItems.length; i++)
			client.searchResultsConnects[client.searchResultsConnects.length] = connect(searchItems[i], "onclick", client.clickSearchResult);			
			
		var moreButton = getObjectFromID("CSBmoreButton");

		if(moreButton)
			client.searchResultsConnects[client.searchResultsConnects.length] = connect(moreButton, "onclick", client.getMoreResults);			

		closeButton.className = "graphicButtons buttonX";
		
	},//end method
	
	
	
	getMoreResults: function(e){
		
		window.clearTimeout(client.blurIdent);
		client.blurIdent = false;
		
		var button = e.src();
		
		var thediv = button.parentNode;
		
		thediv.parentNode.removeChild(thediv);
		
		var csbResults = getObjectFromID("CSBResults");
		
		csbResults.style.height = "330px";
		
		var offset = button.value 
		button.id = "invalid-removed";
		
		client.lookup(offset);	
		
		var clientdisplay = getObjectFromID("clientdisplay");
		clientdisplay.focus();
		
	},//end method
	
	
	clickSearchResult: function(e){
		
		window.clearTimeout(client.blurIdent);
		client.blurIdent = false;
		
		client.chooseSearchItem(e.src());
		e.stop();
		
	},//end method
	
	
	blurIdent: false,
	
	blurDisplay: function(e){
		
		client.blurIdent = window.setTimeout("client._blurDisplay()",200);
		
	},//end method
	
	
	_blurDisplay: function(){
		
		var clientdisplay = getObjectFromID("clientdisplay");
		
		if(client.searchBox || clientdisplay.value != client.committedDisplayValue){
			
			var highlight = getElementsByClassName("CSBSelected");

			if(highlight.length !== 0){
				
				client.chooseSearchItem(highlight[0])
				
			} else {
				
				client.cancelSearch();
				
			}//end if
			
		}//end if
		
		client.blurIdent = false;
		
	},//end method
	
	
	chooseSearchItem: function(atag){
		
		var clientid = getObjectFromID("clientid");
		var clientdisplay = getObjectFromID("clientdisplay");
		var clienttype = getObjectFromID("clienttype")
		
		clientid.value = atag.id.substr(4);
		
		for(var i=0; i< atag.childNodes.length; i++)
			if(atag.childNodes[i].className)
				if(atag.childNodes[i].className == "CSBMain")
					clientdisplay.value = atag.childNodes[i].innerHTML;
		
		var classes = atag.className.split(" ");
		clienttype.value = classes[1];
		
		client.committedDisplayValue = clientdisplay.value;
		client.displayValue = clientdisplay.value;
		
		//remove the box
		clientdisplay.parentNode.removeChild(client.searchBox);
		
		client.searchBox = null;
		
		// need to change invoice type if set to order or quote
		// and no invoice id set
		var id = getObjectFromID("id");
		if(!id.value){
			
			var thetype = getObjectFromID("type");
			if(thetype.value == "Order" || thetype.value == "Quote"){
				if(clienttype.value == "prospect")
					thetype.selectedIndex = 0;
				else
					thetype.selectedIndex = 1;
					
			}//end if			
			
		}//endif
		
		client.getInfo()
		
	},//end method
	
	
	searchBoxConnects: Array(false,false),

	createSearchBox: function(){
		
		//need to grab search box for reference x and ys
		var clientdisplay = getObjectFromID("clientdisplay");
		
		if(client.searchBoxConnects[0])
			disconnect(client.searchBoxConnects[0]);

		if(client.searchBoxConnects[1])
			disconnect(client.searchBoxConnects[1]);

		client.searchBox = document.createElement("div");
		client.searchBox.id = "clientSearchBox";

		var thetop = getTop(clientdisplay) + clientdisplay.offsetHeight;
		var theleft = getLeft(clientdisplay);

		client.searchBox.style.top = thetop + "px";
		client.searchBox.style.left = theleft + "px";

		client.searchBox.innerHTML='\
			<div id="CSBHeader"><button type="button" id="CSBCloseButton" class="graphicButtons buttonSpinner" tabindex="4000"><span>close</span></button></div>\
			<div id="CSBResults"></div>\
			<div id="CSBFooter"><button type="button" class="graphicButtons buttonPlus" id="CSBAddNewButton" title="Add New Client or Prospect" tabindex="4000">Add New</button></div>';
		
		clientdisplay.parentNode.appendChild(client.searchBox);
		
		var addNewButton = getObjectFromID("CSBAddNewButton");
		var closeButton = getObjectFromID("CSBCloseButton");
		
		client.searchBoxConnects[0] = connect(addNewButton,"onclick",client.confirmClient);
		client.searchBoxConnects[1] = connect(closeButton,"onclick",client.cancelSearch);
		
	},//end method
	
	
	cancelSearch: function(e){
		
		var clientdisplay = getObjectFromID("clientdisplay");
				
		if(client.searchBox)		
			clientdisplay.parentNode.removeChild(client.searchBox);
		
		clientdisplay.value = client.committedDisplayValue;
		client.displayValue = client.committedDisplayValue;
		client.searchBox = null;
		
	},//end method
	
	
	confirmConnects: Array(false,false),
	
	confirmDirection: "new",

	confirmClient: function(e){
		
		if(client.confirmConnects[0])
			disconnect(client.confirmConnects[0])
		
		if(client.confirmConnects[1])
			disconnect(client.confirmConnects[1])

		var theButton = e.src();
		
		var content='\
			<p>You are about to navigate away from the sales order screen.  If you have not saved will be lost</p>\
			<p align="right"><button type="button" class="Buttons" id="clientContinueButton">continue</button> <button type="button" class="Buttons" id="clientCancelButton">cancel</button></p>';
		
		showModal(content,"Confirm",350);
		
		var continueButton = getObjectFromID("clientContinueButton");
		var cancelButton = getObjectFromID("clientCancelButton");
		
		client.confirmConnects[0] = connect(cancelButton, "onclick", closeModal);
		client.confirmConnects[1] = connect(continueButton, "onclick", client.goClient);
		
		if(theButton.id == "CSBAddNewButton")
			client.confirmDirection = "new";
		else
			client.confirmDirection = "edit";
		
	},//end method	
		

	goClient: function(){		
		
		var addeditfile = getObjectFromID("clientAddEditFile");
		var theURL = "";
		
		theURL = addeditfile.value;
		
		if(client.confirmDirection == "edit"){

			var theclient = getObjectFromID("clientid");
			var theid = getObjectFromID("id");
			
			if (theclient.value != "" &&  theclient.value!=0)
				theURL += "?id=" + theclient.value + "&invoiceid=" + theid.value;

		}//end if
		
		location.href =  theURL;
		
	},//end method
	
	


	getInfo: function(e){
					
		var clientid=getObjectFromID("clientid");	
		var theitem, thevalue, fieldName, ident;
		var base = document.URL;
		base = base.substring(0,base.indexOf("invoices_addedit.php"));
		
		if(clientid.value!="") {
			var theurl=base+"invoices_client_ajax.php?w=id&t="+clientid.value;
			loadXMLDoc(theurl,null,false);
			response = req.responseXML.documentElement;
			
			for(i=0;i<response.getElementsByTagName('field').length;i++){
				
				fieldName = response.getElementsByTagName('field')[i].attributes.getNamedItem("name").value;
				
				theitem = getObjectFromID(fieldName);
				
				thevalue = response.getElementsByTagName('field')[i].attributes.getNamedItem("value").value;
					
				if(!theitem)
					alert("<b>Error</b><br /> Could not find field: " + fieldName);
				else{							
					
					theitem.value = thevalue;
					
					if(theitem.id != "taxareaid" && theitem.id != "discountid"){
						
						//legeacy
						if(theitem.onchange) theitem.onchange();
						
						ident = getIdent(theitem, "onchange");
						if(ident)
							ident[2]();
						
						//legacy
						if(theitem.onblur) theitem.onblur();
						
						ident = getIdent(theitem, "onblur");
						if(ident)
							ident[2]();
							
					}//end if

				}//endif
			}//endfor
			
			//now need to run taxarea and discount on changes (due to AJAX calls)
			discount.get();
			
			var tempitem=getObjectFromID("taxareaid");
			tempitem.onchange();		
		} else {
			
			//blank out current shipping
			theitem=getObjectFromID("address1");
			if((theitem.value!="") && confirm("Do you wish to clear the shipping information?")){
					theitem.value="";
					theitem=getObjectFromID("address2");
					theitem.value="";
					theitem=getObjectFromID("city");
					theitem.value="";
					theitem=getObjectFromID("state");
					theitem.value="";
					theitem=getObjectFromID("postalcode");
					theitem.value="";
					theitem=getObjectFromID("country");
					theitem.value="";
			}//endif
		}//end if
		
		return true;
		
	}//end method


}//end class


// LINEITEMS CLASS ================================================
//=================================================================
lineitems = {
	
	hoverIn: function(e){
		
		srcObj = e.src();

		lineitems._hover(srcObj, "in");

	},//end function


	hoverOut: function(e){

		srcObj = e.src();
		
		lineitems._hover(srcObj, "out");

	}, //end function
	
	
	_hover: function(tr,way){
		
		var type = getObjectFromID("type");
		
		if(type.value == "Order" || type.value =="Quote"){
			
			var display = "none";
			
			if(way == "in")
				display = "block";
				
			var buttonDiv = getObjectFromID(tr.id+"ButtonsDiv");
			buttonDiv.style.display = display;
		
		}//end if
		
	}, //end function


	add: function(e){
						
		var thelastrow = getObjectFromID("LITotals");
		var tbody = thelastrow.parentNode;
		
		var productid = getObjectFromID("partnumber");
		var partnumber = getObjectFromID("ds-partnumber");
		var partname = getObjectFromID("ds-partname");
		var memo = getObjectFromID("memo");
		var unitweight = getObjectFromID("unitweight");
		var unitcost = getObjectFromID("unitcost");
		var unitprice = getObjectFromID("price");
		var quantity = getObjectFromID("qty");
		var taxable = getObjectFromID("taxable");
		var extended = getObjectFromID("extended");
	
		if(unitcost.value == "")
			unitcost.value = "0";
			
		if(unitweight.value=="")
			unitweight.value="0";
		
		//Create the line
		var thetr = document.createElement("tr");
		
		thetr.id="li" + lineitems._getNextID();

		thetr.className="lineitems";
		
		
		//first TD holds hidden fields and displays part name and number
		var temptd = document.createElement("td");
		temptd.setAttribute("colSpan",2);
		temptd.className="lineitemsLeft";
		
		//inputs		
		var tempinput = document.createElement("input");
		tempinput.setAttribute("type", "hidden");
		tempinput.id = thetr.id + "ProductID";
		tempinput.value = productid.value;
		temptd.appendChild(tempinput);
		
		tempinput = document.createElement("input");
		tempinput.setAttribute("type", "hidden");
		tempinput.id = thetr.id + "Taxable";
		tempinput.value = taxable.value;
		temptd.appendChild(tempinput);
		
		tempinput = document.createElement("input");
		tempinput.setAttribute("type", "hidden");
		tempinput.className = "lineitemWeights";
		tempinput.id = thetr.id + "UnitWeight";
		tempinput.value = unitweight.value;
		temptd.appendChild(tempinput);
		
		tempinput = document.createElement("input");
		tempinput.setAttribute("type", "hidden");
		tempinput.className = "lineitemCosts";
		tempinput.id = thetr.id + "UnitCost";
		tempinput.value = unitcost.value;
		temptd.appendChild(tempinput);

		var tempdiv = document.createElement("div");
		if(partnumber.value || partname.value)
			tempdiv.innerHTML = '<p>' + partnumber.value + '</p><p class="important">' + partname.value + '</p>';
		else
			tempdiv.innerHTML = "&nbsp;";
		
		temptd.appendChild(tempdiv);

		thetr.appendChild(temptd);
		
		//next td is for memo
		temptd = document.createElement("td");

		tempinput = document.createElement("input");
		tempinput.id = thetr.id + "Memo";
		tempinput.className = "lineitemMemos"
		tempinput.value = memo.value;

		connect(tempinput, "onchange", lineitems.markChanged);

		temptd.appendChild(tempinput);

		thetr.appendChild(temptd);

		//next td is for unit price
		temptd = document.createElement("td");

		tempinput = document.createElement("input");
		tempinput.id = thetr.id + "UnitPrice";
		tempinput.className = "fieldCurrency lineitemPrices"
		tempinput.value = unitprice.value;

		connect(tempinput, "onchange", lineitems.calculateExtended);
		
		temptd.appendChild(tempinput);

		thetr.appendChild(temptd);

		//next td is for quantity
		temptd = document.createElement("td");

		tempinput = document.createElement("input");
		tempinput.id = thetr.id + "Quantity";
		tempinput.className = "lineitemQuantities"
		tempinput.value = quantity.value;

		connect(tempinput, "onchange", lineitems.calculateExtended);
		
		temptd.appendChild(tempinput);

		thetr.appendChild(temptd);

		//next td is for extended
		temptd = document.createElement("td");

		tempinput = document.createElement("input");
		tempinput.id = thetr.id + "Extended";
		tempinput.className = "uneditable fieldCurrency lineitemExtendeds"
		tempinput.readOnly = true;
		tempinput.value = extended.value;
		temptd.appendChild(tempinput);

		thetr.appendChild(temptd);
		
		//last td is for buttons
		
		temptd=document.createElement("td");
		temptd.className = "lineitemsButtonTDs";
		
		var content = '<div id="' + thetr.id + 'ButtonsDiv" class="lineitemsButtonDivs">' +
		'					<button type="button" id="' + thetr.id + 'ButtonDelete" class="graphicButtons buttonMinus LIDelButtons" title="Remove line item"><span>-</span></button><br />' +
		'					<button type="button" id="' + thetr.id + 'ButtonMoveUp" class="graphicButtons buttonUp LIUpButtons" title="Move Item Up"><span>Up</span></button><br />' +
		'					<button type="button" id="' + thetr.id + 'ButtonMoveDown" class="graphicButtons buttonDown LIDnButtons" title="Move Item Down"><span>Dn</span></button><br />' +
		'				</div>';

		temptd.innerHTML = content;
		
		thetr.appendChild(temptd);
	
		tbody.insertBefore(thetr,thelastrow);
		
		// connect the TR listners
		connect(thetr, "onmouseover", lineitems.hoverIn);
		connect(thetr, "onmouseout", lineitems.hoverOut);		

		var delButton = getObjectFromID(thetr.id+"ButtonDelete");
		connect(delButton, "onclick", lineitems.del);
		
		var moveUpButton = getObjectFromID(thetr.id+"ButtonMoveUp");
		connect(moveUpButton, "onclick", lineitems.moveUp);

		var moveDnButton = getObjectFromID(thetr.id+"ButtonMoveDown");
		connect(moveDnButton, "onclick", lineitems.moveDn);

		//Update Totals
		invoice.doAllTotals();
		
		//clear line
		productid.value="";
		partnumber.value="";
		partname.value="";
		memo.value="";
		taxable.value=1;
		unitweight.value=0
		unitcost.value=0
		unitprice.value=numberToCurrency(0);
		quantity.value="1";
		extended.value=numberToCurrency(0);
		autofill["partname"]["ch"]="";
		autofill["partname"]["uh"]="";
		autofill["partname"]["vl"]="";	
		autofill["partnumber"]["ch"]="";
		autofill["partnumber"]["uh"]="";
		autofill["partnumber"]["vl"]="";
		
		lineitems.markChanged();
	
	}, // end function
	
	
	markChanged: function(){
		
		var lineitemschanged = getObjectFromID("lineitemschanged");
		lineitemschanged.value = 1;	

	}, //end function
	
	
	_getNextID: function(){
		
		var theid = 0
		
		trs = getElementsByClassName("lineitems");
		for(var i = 0; i< trs.length; i++)
			if(parseInt(trs[i].id.substr(2)) > theid)
				theid = parseInt(trs[i].id.substr(2));
		
		theid++;
		
		return theid;
		
	}, //end function
	

	calculateExtended: function(e){
		
		theTR = e.src().parentNode.parentNode;
		
		lineitems._calculateExtended(theTR)
		
	}, //end function


	_calculateExtended: function(theTR){		

		if(theTR.id == "LIAdd"){
			
			var thecurrency = getObjectFromID("price");	
			var quantity = getObjectFromID("qty");
			var extField = getObjectFromID("extended");				
			
		} else {
			
			var thecurrency = getObjectFromID(theTR.id+"UnitPrice");	
			var quantity = getObjectFromID(theTR.id+"Quantity");
			var extField = getObjectFromID(theTR.id+"Extended");	
			
		}//end if
	
		// First, Check and format the price
		var theprice = currencyToNumber(thecurrency.value);
		thecurrency.value = numberToCurrency(theprice);
				
		// Next verify that qty is a number
		var qty = parseFloat(quantity.value);
	
		if(isNaN(qty))
			qty = 0;
			
		quantity.value = qty;
	
		// Last, figure extended and reformat to dollar
		var extended = roundForCurrency(qty * theprice);
		extField.value = numberToCurrency(extended);
		
		//if this is a modification, we also need to calculate totals and mark line items changed
		if(theTR.id != "LIAdd"){

			invoice.doAllTotals();
			lineitems.markChanged();

		}//end if
		
	},//end function
	
	
	del: function(e){
		
		var theTR = e.src().parentNode.parentNode.parentNode;
		var tbody = theTR.parentNode;
		
		//remove all listners
		var ident = getIdent(theTR, "onmouseover");				
		if(ident) disconnect(ident);

		ident = getIdent(theTR, "onmouseout");
		if(ident) disconnect(ident);
		
		var memo = getObjectFromID(theTR.id+"Memo")
		ident = getIdent(memo, "onchange");
		if(ident) disconnect(ident);

		var unitprice = getObjectFromID(theTR.id+"UnitPrice")
		ident = getIdent(unitprice, "onchange");
		if(ident) disconnect(ident);

		var qty = getObjectFromID(theTR.id+"Quantity")
		ident = getIdent(qty, "onchange");
		if(ident) disconnect(ident);

		var delButton = getObjectFromID(theTR.id+"ButtonDelete")
		ident = getIdent(delButton, "onclick");
		if(ident) disconnect(ident);

		var mvUpButton = getObjectFromID(theTR.id+"ButtonMoveUp")
		ident = getIdent(mvUpButton, "onclick");
		if(ident) disconnect(ident);

		var mvDnButton = getObjectFromID(theTR.id+"ButtonMoveDn")
		ident = getIdent(mvDnButton, "onclick");
		if(ident) disconnect(ident);

		tbody.removeChild(theTR);

		invoice.doAllTotals();
		lineitems.markChanged();
		
	},//end function


	moveUp: function(e){

		var theTR = e.src().parentNode.parentNode.parentNode;
		
		lineitems._move(theTR, "up");
		
	},//end function
	
	
	moveDn: function(e){

		var theTR = e.src().parentNode.parentNode.parentNode;
		
		lineitems._move(theTR, "dn");
		
	},//end function


	_move: function(theTR, direction){
		
		var tbody = theTR.parentNode;		
		
		var lineitemsArray = getElementsByClassName("lineitems");
		
		if(direction == "up"){
			
			if(theTR == lineitemsArray[0])
				return false;
				
		} else {

			if(theTR == lineitemsArray[lineitemsArray.length-1])
				return false;
				
		}//end if
		
		var beforeTR = null;
		
		for(var i = 0; i < lineitemsArray.length; i++)
			if(lineitemsArray[i] == theTR)
				if(direction == "up")
					beforeTR = lineitemsArray[i-1];
				else
					if(i+2 == lineitemsArray.length)
						beforeTR = getObjectFromID("LITotals");
					else
						beforeTR = lineitemsArray[i+2];
						
		tbody.removeChild(theTR);
		tbody.insertBefore(theTR, beforeTR);
		
		lineitems._hover(theTR, "out");
		
		lineitems.markChanged();
		
	},//end function
	
	
	prepareForPost: function(){
		
		var thelist = "";
		
		lineitemsArray = getElementsByClassName("lineitems");
		
		var theid, productid, taxable, unitweight, unitcost, unitprice, qty;
		
		for(var i=0; i<lineitemsArray.length; i++){
			
			theid = lineitemsArray[i].id;
			productid = getObjectFromID(theid + "ProductID");
			taxable = getObjectFromID(theid + "Taxable");
			unitweight = getObjectFromID(theid + "UnitWeight");
			unitcost = getObjectFromID(theid + "UnitCost");
			unitprice = getObjectFromID(theid + "UnitPrice");
			qty = getObjectFromID(theid + "Quantity");
			memo = getObjectFromID(theid + "Memo")
			
			thelist += 	productid.value + "::" + 
						memo.value.replace(/::|;;/g,"-") + "::" +
						taxable.value + "::" +
						unitweight.value + "::" +
						unitcost.value + "::" +
						currencyToNumber(unitprice.value) + "::" +
						qty.value + ";;";						
			
		}//end for
		
		if(thelist.length > 1)
			thelist = thelist.substr(0, thelist.length-2);
		
		var itemslist = getObjectFromID("thelineitems");
		itemslist.value = thelist
		
	}//end function
	
}//end class




function payInFull(){

	var amtpaid = getObjectFromID("amountpaid");
	var totalti = getObjectFromID("totalti");

	amtpaid.value=totalti.value;
	
	calculatePaidDue();
	
}

// These function are used when redefining the onchange property of 
// a hidden field for the the taxAreaID.  It uses XMLHttpRequest to
// grab the tax percentage.
function getPercentage(){
	var theitem,thevalue,repsponse;
	var taxareaid =getObjectFromID("taxareaid");	
	var parentax=getObjectFromID("parenTax");
	var taxbox=getObjectFromID("tax")
	
	var base=document.URL;
	base=base.substring(0,base.indexOf("invoices_addedit.php"));
	
	if(taxareaid.value!=0){
		var theurl=base+"invoices_tax_ajax.php?id="+taxareaid.value;
		//need this to be synchronous, so the window does not close and 
		//yack.
		loadXMLDoc(theurl,null,false);
		response = req.responseXML.documentElement;
		thevalue = response.getElementsByTagName('value')[0].firstChild.data;
		theitem=getObjectFromID("taxpercentage");		
		theitem.value=thevalue+"%";
		parentax.innerHTML="("+taxareaid.options[taxareaid.selectedIndex].text+")";
	} else {
		theitem=getObjectFromID("taxpercentage");
		theitem.value="";
		taxbox.value="0";
		parentax.innerHTML="&nbsp;";
	}
	calculateTotal();

	return true;
}


function clearTaxareaid(){
	var taxpercent=getObjectFromID("taxpercentage");
	var thetaxareaid=getObjectFromID("taxareaid");
	var parentax=getObjectFromID("parenTax");	
	thetaxareaid.selectedIndex=0;
	calculateTotal();
	parentax.innerHTML="("+taxpercent.value+")";
}


function changeTaxAmount(){
	var taxpercent=getObjectFromID("taxpercentage");
	var thetaxareaid=getObjectFromID("taxareaid");
	var parentax=getObjectFromID("parenTax");	
	taxpercent.value="";
	thetaxareaid.selectedIndex=0;
	calculateTotal();
	parentax.innerHTML="("+taxpercent.value+")";
}


function changeShipping(){
	var theselect = getObjectFromID("shippingmethodid");
	var estimateShippingButton=getObjectFromID("estimateShippingButton");

	var newClass="graphicButtons buttonShipDisabled";
	var parenShipping=getObjectFromID("parenShipping");
	
	if(theselect.value!=0){
		parenShipping.innerHTML="("+theselect.options[theselect.selectedIndex].text+")";
		if(shippingMethods[theselect.value]["canestimate"]==1){
			newClass="graphicButtons buttonShip";
		}
	} else
		parenShipping.innerHTML="&nbsp;";
		
	estimateShippingButton.className = newClass;
}


shippingNotice="";
function startEstimateShipping(){
	
	if(vTab.timeout!=0)
		vTab.clearTO();
	
	var thebutton = getObjectFromID("estimateShippingButton");
	
	if(thebutton.className.indexOf("Disabled") == -1){
		
		if(shippingNotice=="") {
			var noticeHolder=getObjectFromID("shippingNotice")
			shippingNotice=noticeHolder.innerHTML;
			noticeHolder.innerHTML="";
		}
		
		showModal(shippingNotice,"Estimate Shipping",400,10);		
		
	}//end if
	
}//end function


function performShippingEstimate(base){

	var resultsArea = getObjectFromID("shippingNoticeResults");

	var currentShipping = getObjectFromID("shippingmethodid").value;
	
	var theURL = base+shippingMethods[currentShipping]["estimationscript"];
	
	var shiptozip = getObjectFromID("postalcode");	

	var therespond= "";

	resultsArea.value = "Starting Script (this may take a moment)\n";
	
	theURL+="?shipvia="+encodeURI(shippingMethods[currentShipping]["name"]);
	
	//Get line items
	var theLineItems = getElementsByClassName("lineitems");
	var productid = null;
	var productArray = Array();
	var j;
	
	for(var i=0; i< theLineItems.length; i++){
		
		productid = getObjectFromID(theLineItems[i].id + "ProductID");

		if(productid.value){
			
			productArray[productArray.length] = getObjectFromID(theLineItems[i].id + "Quantity").value;
			productArray[productArray.length] = currencyToNumber(getObjectFromID(theLineItems[i].id + "UnitPrice").value);
			productArray[productArray.length] = getObjectFromID(theLineItems[i].id + "UnitCost").value;
			productArray[productArray.length] = getObjectFromID(theLineItems[i].id + "UnitWeight").value;
			productArray[productArray.length] = getObjectFromID(theLineItems[i].id + "Taxable").value;
		
			theURL += "&LI" + i + "=" + encodeURI(productid.value);
				
			for(j = 0; j< productArray.length; j++)				
				theURL += encodeURI("::" + productArray[j]);				
			
		}//endif
		
	}//endfor

	theURL+="&postalcodeto="+encodeURI(shiptozip.value);

	//timestamp for client caching
	var today = new Date();
	theURL += "&rand=" + today.getTime();
	
	loadXMLDoc(theURL,null,false);

	if(req.responseXML){
		
		var newShippingAmount = req.responseXML.documentElement.getElementsByTagName('value')[0].firstChild.data;
		
		if(newShippingAmount==0){
			
			therespond = "Estimation returned 0 or Failed.  Check the client's postal code, " + 
			             "and the line item products shipping setup.";
		} else {
			
			var shipping=getObjectFromID("shipping");
			shipping.value=newShippingAmount;
			calculateTotal();
			therespond="Shipping Amount Updated";
			
		}
	} else
	therespond = req.responseText

	resultsArea.value+="Script Response:\n"+therespond+"\n";

}


//this function opens a page in a new window that will lookup and populate the add line item info based on a choosen partnumber
function populateLineItem(){
	if (this.value!=""){
		var clientid=getObjectFromID("clientid")
		var partnumber=getObjectFromID("partnumber");
		var partnumberDS=getObjectFromID("ds-partnumber");
		var partname=getObjectFromID("partname");
		var partnameDS=getObjectFromID("ds-partname");
		var tempitem;
		
		var base=document.URL;
		base=base.substring(0,base.indexOf("invoices_addedit.php"));

		var theurl=base+"invoices_lineitem_ajax.php?id="+this.value;
		theurl=theurl+"&cid="+clientid.value;
		
		loadXMLDoc(theurl,null,false);
		response = req.responseXML.documentElement;		
		
		if(response.getElementsByTagName('value')[0].firstChild)
			if(response.getElementsByTagName('value')[0].firstChild.data=="Prerequisite Not Met"){
				// did not meet prerequisites
				var message="The product you entered has prerequisite products that must have<br />";
				message+=	"been purchased by the client prior to ordering this product.<br /><br />";
				message+= 	"Make sure the client has been entered and that they have purchased<br />";
				message+= 	"any prerequiste products before adding this product.";
				message+=	"<DIV align=\"right\"><button class=\"Buttons\" onclick=\"closeModal()\" style=\"width:75px\">ok</button></DIV>";

				
				partnumber.value="";
				partnumberDS.value="";
				partname.value="";
				partnameDS.value="";
				partnameDS.focus();
				showModal(message,"Prerequisite Not Met",400,10);

			} else {
				for(i=0;i<response.getElementsByTagName('field').length;i++){
					
					tempitem=getObjectFromID(response.getElementsByTagName('field')[i].firstChild.data);
					if(!tempitem) 
						alert("Field not found: "+response.getElementsByTagName('field')[i].firstChild.data);

					thevalue="";

					if(response.getElementsByTagName('value')[i].firstChild)
						thevalue=response.getElementsByTagName('value')[i].firstChild.data;
						
					tempitem.value=thevalue;
					if(tempitem.id == "price")
						lineitems._calculateExtended(tempitem.parentNode.parentNode);
						
					if(tempitem.onchange && tempitem.name=="price") tempitem.onchange();
					
				}//endfor
				
				
				if(this.form["memo"]) this.form["memo"].focus();
			}
		
	}
	return true;
}


//this function sets the default shipped date information for shipping appropriately
function setShipped(){
	var thecheckbox=getObjectFromID("statusShipped");
	var thedate=getObjectFromID("shippeddate");

	if(thecheckbox){
		if(thecheckbox.checked && thecheckbox.disabled==false && thedate.value=="") {
			var currentdate= new Date();
			thedate.value=(currentdate.getMonth()+1)+"/"+currentdate.getDate()+"/"+currentdate.getFullYear();
		} 
	}
}

//this function calulates how much is left to pay
function calculatePaidDue(){
	var paid=document.forms["record"]["amountpaid"].value;
	var total=document.forms["record"]["totalti"].value;

	//first calculate and reformat amountpaid
	var numpaid=currencyToNumber(paid);
	paid=numberToCurrency(numpaid);
	document.forms["record"]["amountpaid"].value=paid;

	//Next Calculate Amount Due
	var numtotal=currencyToNumber(total);
	var due=numtotal-numpaid;
	due=numberToCurrency(due);
	
	document.forms["record"]["amountdue"].value=due;
}

//this function adds all the tax,shipping,subtotal, and totaling stuff
function calculateTotal(){
	
	var thetotalBD=getObjectFromID("totalBD");
	var subtotal=getObjectFromID("totaltni");
	var thediscount=getObjectFromID("discountamount");
	var shipping=getObjectFromID("shipping"); 
	var taxpercentage=getObjectFromID("taxpercentage");
	var tax=getObjectFromID("tax");
	var totalti=getObjectFromID("totalti");
	var totaltaxable=getObjectFromID("totaltaxable");
	var discountFromID=getObjectFromID("discount");
	
	//calculate and reformat discount
	var numDiscount;
	if(discountFromID.value=="" || discountFromID.value=="0" || discountFromID.value=="0%"){
		numDiscount=currencyToNumber(thediscount.value);
	} else {
		// compute discount from discount id
		if(discountFromID.value.indexOf("%")!=-1){
			numDiscount=parseFloat(thetotalBD.value)*parseFloat(discountFromID.value.substring(0,discountFromID.value.length-1))/100
		} else {
			numDiscount=parseFloat(discountFromID.value);
		}
	}

	thediscount.value= numberToCurrency(numDiscount);

	//calculate totaltaxable
	if(totaltaxable.value == "")
		totaltaxable.value = 0;
	var numTotalTaxable=parseFloat(totaltaxable.value)-numDiscount;

	//calculate and reformat subtotal
	var numsubtotal=parseFloat(thetotalBD.value)-numDiscount;
	var subtotalValue=numberToCurrency(numsubtotal);
	subtotal.value=subtotalValue;

	//next calculate and reformat shipping
	var numshipping=currencyToNumber(shipping.value);
	shippingValue=numberToCurrency(numshipping);
	shipping.value=shippingValue;

	//next calculate and reformat tax
	var taxpercentagevalue=getNumberFromPercentage(taxpercentage.value)
	if (taxpercentagevalue!=0){
		var numtax=numTotalTaxable*(taxpercentagevalue/100);		
		if(numtax<0) numtax=0;
	}
	else {
		var numtax=currencyToNumber(tax.value);
		if(numTotalTaxable>0)
			taxpercentagevalue=(numtax/numTotalTaxable)*100;
		else
			taxpercentagevalue=0;
		taxpercentage.value=taxpercentagevalue;
		validatePercentage(taxpercentage,5);
	}

	taxValue=numberToCurrency(numtax);
	tax.value=taxValue;

	//last calculate and format the grand total
	var thetotal=numsubtotal+numshipping+numtax;
	thetotal=numberToCurrency(thetotal);
	totalti.value=thetotal;
	
	calculatePaidDue();
}


function showPaymentOptions(){
	var paymentmethodid = getObjectFromID("paymentmethodid");

	var checkinfo=getObjectFromID("checkpaymentinfo");
	var ccinfo=getObjectFromID("ccpaymentinfo");
	var receivableinfo = getObjectFromID("receivableinfo");
	
	var amountpaid = getObjectFromID("amountpaid");
	var payinfull = getObjectFromID("payinfull");
	var amountdue = getObjectFromID("amountdue");
	var totalti = getObjectFromID("totalti");

	var theType;
	if(parseInt(paymentmethodid.value) == 0)
		theType="";
	else
		theType=paymentMethods[parseInt(paymentmethodid.value)]["type"];

	//display appropriate payment details
	switch(theType){

		case "draft":
			checkinfo.style.display = "block";
			ccinfo.style.display = "none";
			receivableinfo.style.display = "none";
			amountpaid.className = "important fieldCurrency fieldTotal";
			amountpaid.readOnly = false;
			payinfull.style.display = "inline";
			break;

		case "charge":
			checkinfo.style.display = "none";
			receivableinfo.style.display = "none";
			ccinfo.style.display = "block";
			amountpaid.className = "important fieldCurrency fieldTotal";
			amountpaid.readOnly = false;
			payinfull.style.display = "inline";
			break;

		case "receivable":
			//first let's check to make sure they can charge to AR
			var hascredit = getObjectFromID("hascredit");
			var creditleft = getObjectFromID("creditleft");
			var totalti = getObjectFromID("totalti");
			var clientid = getObjectFromID("clientid");
			var type = getObjectFromID("type");
			
			var error = "";
			if(!clientid.value)
				error = "Receivable payment method cannot be set until a client is chosen";
			
			if(hascredit.value == 0 && error == "" && type.value != "Invoice" && type.value != "VOID")
				error = "This client is not currenlty set up with a line of credit.";

			if(currencyToNumber(creditleft.value) < currencyToNumber(totalti.value) && error == "" && type.value != "Invoice" && type.value != "VOID")
				error = "Order amount is greater than client's credit limit ("+creditleft.value+" left)";
			
			if(error){
				
				paymentmethodid.selectedIndex = 0;
				alert(error);
				showPaymentOptions();
				return false;
				
			}//endif
			
			receivableinfo.style.display = "block";
			checkinfo.style.display = "none";
			ccinfo.style.display = "none";

			if(type.value != "Invoice"){

				amountpaid.value = numberToCurrency(0);
				amountdue.value = totalti.value;
				
			}//endif
			amountpaid.className = "important fieldCurrency fieldTotal uneditable";
			amountpaid.readOnly = true;
			payinfull.style.display = "none";
			break;
			
		default:
			receivableinfo.style.display = "none";
			checkinfo.style.display="none";
			ccinfo.style.display="none";
			amountpaid.className = "important fieldCurrency fieldTotal";
			amountpaid.readOnly = false;
			payinfull.style.display = "inline";
			
	}//endswtich
	
	//update parentesis display
	var parenPayment=getObjectFromID("parenPayment");
	if(parseInt(paymentmethodid.value) == 0)
		parenPayment.innerHTML="&nbsp;";
	else
		parenPayment.innerHTML="("+paymentMethods[parseInt(paymentmethodid.value)]["name"]+")";
		
	//next onlinceprocessing
	var online;
	var transactionid=getObjectFromID("pTransactionid");
	var paymentButton=getObjectFromID("paymentProcessButton");

	if(parseInt(paymentmethodid.value) == 0)
		online = 0;
	else
		online = paymentMethods[parseInt(paymentmethodid.value)]["onlineprocess"];
	
	var processscript = getObjectFromID("processscript");

	if(online==1){

		processscript.value = paymentMethods[parseInt(paymentmethodid.value)]["processscript"];
		transactionid.style.display="block";
		paymentButton.className="graphicButtons buttonMoney";
		
	} else {
		
		processscript.value = "";
		transactionid.style.display="none";
		paymentButton.className="graphicButtons buttonMoneyDisabled";
		
	}//endif
	
}//endfunction




function doPrint(base,id){
		location.href=(base+"print.php?backurl="+encodeURIComponent(document.location));
}


function disableSaves(theform){
	for(i=0;i<theform.length;i++){
		if(theform[i].type=="submit" && theform[i].value=="save"){			
			theform[i].disabled="disabled";
		}
	}
}


function showWebConfirmationNum(theitem){
		webdiv=getObjectFromID("webconfirmdiv");
		if (theitem.checked)
			webdiv.style.display="block";
		else
			webdiv.style.display="none";
			
}


function clearDiscount(){
	var discountid=getObjectFromID("discountid");
	var discount=getObjectFromID("discount");
	discount.value="";
	discountid.selectedIndex=0;	
	discountid.value="";
}

// DISCOUNT CLASS
//=================================================================
discount = {
	
	get: function(e){
		
		var thevalue, repsponse;
		var discountid = getObjectFromID("discountid");	
		var parendiscount = getObjectFromID("parenDiscount");
	
		if(discountid.value == 0)
			parendiscount.innerHTML = "&nbsp;";
		else
			parendiscount.innerHTML = "("+discountid.options[discountid.selectedIndex].text+")";
		
		var base = document.URL;
		base=base.substring(0,base.indexOf("invoices_addedit.php"));
		
		var	theitem = getObjectFromID("discount");
	
		var theurl = base+"invoices_discount_ajax.php?id="+discountid.value;
		
		loadXMLDoc(theurl,null,false);
		
		if(!req.responseXML) {
			
			alert(req.responseText);
			return false;
			
		}
		
		response = req.responseXML.documentElement;
		thevalue = response.getElementsByTagName('value')[0].firstChild.data;
		
		theitem.value = thevalue;
		var thediscount = getObjectFromID("discountamount");
		thediscount.value = numberToCurrency(0);
		
		calculateTotal();
		return true;		
		
	}//end if
	
}//end class


// VERTICAL TABS CLASS ============================================
//=================================================================
vTab = {
	timeout: 0,
	
	over: function(e){
		
		thetab = e.src();

		//cancel any timeouts
		if(vTab.timeout !=0 )
			vTab.clearTO()
		
		//onhover any tabs that are active
		var i;
		var othertab;
		var othercontent;

		for(i=1;i<5;i++){

			if("vTab"+i != thetab.id){
				othertab=getObjectFromID("vTab"+i);
				othercontent=getObjectFromID("vContent"+i)			
				othertab.className="invoiceTotalLabels vTabs";
				othercontent.style.display="none";
			} else {
				var thecontent=getObjectFromID("vContent"+i);
			}//end if
			
		}//endfor
		
		var pareninfo=getObjectFromID("parenInfo");
		pareninfo.style.display="none";
		
		//change to hover class
		thetab.className="invoiceTotalLabels vTabsHover";
		thecontent.style.display="block";
		thecontent.style.height=(thecontent.parentNode.offsetHeight-18)+"px";
		
		for(i=0;i<thecontent.childNodes.length;i++)
			if(thecontent.childNodes[i].tagName=="FIELDSET")
				thecontent.childNodes[i].style.height=(thecontent.offsetHeight-36)+"px";	
				
	},//end method
	
	
	out: function(e){

		var i;
		var thetab;
		
		for(i=1;i<5;i++){
			thetab=getObjectFromID("vTab"+i);
			if(thetab.className=="invoiceTotalLabels vTabsHover"){
				thetab.className="invoiceTotalLabels vTabs";
				thecontent=getObjectFromID("vContent"+i)
				thecontent.style.display="none";
			}
		}
		
		var pareninfo=getObjectFromID("parenInfo");
		pareninfo.style.display="block";
		vTab.timeout=0;

	},//end method


	clearTO: function(e){
		
		window.clearTimeout(vTab.timeout);
		vTab.timeout = 0;
		
	},//end method


	setTO: function(e){
		
		vTab.timeout = window.setTimeout("vTab.out()",1000);
		
	}//end method
	
}//end class


/* OnLoad Listner ---------------------------------------- */
/* ------------------------------------------------------- */
connect(window,"onload",function() {

	calculateTotal();
	showPaymentOptions();

	var clientid = getObjectFromID("clientid");
	var clientdisplay = getObjectFromID("clientdisplay");
	var viewClientButton = getObjectFromID("viewClientButton");
	var id = getObjectFromID("id");

	clientdisplay.setAttribute('autocomplete','off');
	connect(clientdisplay, "onkeyup", client.changeDisplay);
	connect(clientdisplay, "onblur", client.blurDisplay);
	connect(viewClientButton, "onclick", client.confirmClient);
	
	if(!clientid.value){
		
		clientdisplay.focus();
		
	} else {
		
		client.displayValue = clientdisplay.value;
		client.committedDisplayValue = clientdisplay.value;
		
	}//end if

	if(!id.value)
		viewClientButton.style.display = "none";
	
	var theForm = getObjectFromID("record");
	connect(theForm, "onsubmit", invoice.submitForm);
	
	
	var assignedtoid = getObjectFromID("assignedtoid");
	connect(assignedtoid, "onchange", theStatus.statusChange);
	
	var statusdate = getObjectFromID("statusdate");
	connect(statusdate, "onchange", theStatus.statusChange);
	
	var statusid = getObjectFromID("statusid");
	connect(statusid,"onchange", theStatus.statusChosen);
	
	var readytopost = getObjectFromID("readytopost");
	connect(readytopost, "onclick", theStatus.checkRTP);
	
	var vTabContents = getElementsByClassName("vContent");
	
	for(var i=0; i< vTabContents.length; i++){
		connect(vTabContents[i],"onmouseover",vTab.clearTO);
		connect(vTabContents[i],"onmouseout",vTab.setTO);
	}

	var vTabs = getElementsByClassName("vTabs");
	for(var i=0; i< vTabs.length; i++){
		connect(vTabs[i],"onmouseover",vTab.over);
		connect(vTabs[i],"onmouseout",vTab.setTO);
	}
	
	var ccnumber1 = getObjectFromID("ccnumber");
	if(ccnumber1){
		var toPass ={
			amt: getObjectFromID("amountpaid"),
			cid: getObjectFromID("clientid"),
			tid: getObjectFromID("id"),
			ccn: ccnumber1,
			ccexp: getObjectFromID("ccexpiration"),
			ccv: getObjectFromID("ccverification")
		};
	
		payment.initialize(getObjectFromID("paymentProcessButton"), getObjectFromID("processscript"), toPass, getObjectFromID("transactionid"))
		
	}
	
	
	var discountid = getObjectFromID("discountid");
	connect(discountid, "onchange", discount.get);
	
	//lineitems	
	var addButton = getObjectFromID("lineitemAddButton");
		if(addButton)
			connect(addButton, "onclick", lineitems.add);
			
	var unitprice = getObjectFromID("price");
		if(unitprice)
			connect(unitprice, "onchange", lineitems.calculateExtended)

	var quantity = getObjectFromID("qty");
		if(quantity)
			connect(quantity, "onchange", lineitems.calculateExtended)

	var trs = getElementsByClassName("lineitems");
	for(i=0; i<trs.length; i++){
		
		connect(trs[i], "onmouseover", lineitems.hoverIn)
		connect(trs[i], "onmouseout", lineitems.hoverOut)
		
	}//endfor
	
	var qtys = getElementsByClassName("lineitemQuantities");
	for(i = 0; i < qtys.length; i++)
		connect(qtys[i], "onchange", lineitems.calculateExtended);

	var unitprices = getElementsByClassName("lineitemPrices");
	for(i = 0; i < unitprices.length; i++)
		connect(unitprices[i], "onchange", lineitems.calculateExtended);
		
	var memos = getElementsByClassName("lineitemMemos");
	for(i = 0; i < memos.length; i++)
		connect(memos[i], "onchange", lineitems.markChanged);
	
	var lineitemDelButtons = getElementsByClassName("LIDelButtons");
	for(i = 0; i < lineitemDelButtons.length; i++)
		connect(lineitemDelButtons[i], "onclick", lineitems.del);

	var lineitemUpButtons = getElementsByClassName("LIUpButtons");
	for(i = 0; i < lineitemUpButtons.length; i++)
		connect(lineitemUpButtons[i], "onclick", lineitems.moveUp);

	var lineitemDnButtons = getElementsByClassName("LIDnButtons");
	for(i = 0; i < lineitemDnButtons.length; i++)
		connect(lineitemDnButtons[i], "onclick", lineitems.moveDn);
		
	if(!id.value && clientdisplay.value){
		
		client.getInfo();
		
		var clienttype = getObjectFromID("clienttype");
		if(clienttype.value == "prospect"){
			
			var thetype = getObjectFromID("type");
			
			thetype.selectedIndex = 0;
			
		}//end if
		
	}//end if


})
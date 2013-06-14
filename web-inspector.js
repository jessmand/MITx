/**
 * A simple web inspector.
 *
 * Intended to be a singleton: this only exists once per page, so it
 * attaches itself to the BODY element.
 */
var Inspector = function ($) {
    var exports = {};

    // The root element of the inspector.
    var root = null;
    
    

    var template = ""
        + "<div class='tray'>"
        + "  <div class='htmlEdit'><textarea class='text-editor'></textarea><button class='updateHTMLbutton'>Update</button></div>"
        + "  <div class='property-editor'>"
        + "    <div class='node-lookup'>"
        + "      &nbsp<label>Selector:<input class='selector'></input></label>&nbsp&nbsp<label>Element #:<input class='nth'></input></label>"
        + "      <button>Search</button>"
        + "    </div>"
        + "     <div class='property-filter'><label class='filterInput'>Show:<input type='text' class='filterInput filterWord'></input></label><button class='filterInput filterButton'>Filter</button><button class='filterInput unfilterButton'>Unfilter</button></div>"
        + "    <div class='property-list'>"
        + "    </div>" 
        + "  </div>" 
        + "</div>" 
        + "<div class='handle'></div>";
    
    
    var toggle = function() {
        if (root.css("top") == "0px") {
            root.animate( {"top": "-300px"} , 500 );
            $('body').animate({"margin-top": "15px", "background-position-y": "15px"},500);
        } else {
            root.animate( {"top": "0px"} , 500 );
            $('body').animate({"margin-top": "315px", "background-position-y": "315px"},500);
        }
    };
    
    var filter = function() {
        var tableRows = $('.property-list').find('table').find('tr');
        var filterWord = $('.filterWord').val();
        var newProperties =[];
        tableRows.each(function() {
            var cell = $(this).find('td').eq(0);
            var property = cell.text();
            if (property.indexOf(filterWord)>=0) {
                newProperties.push(property);
            }
        });
        var propertyTable = "<table>";
        for (var property in newProperties) {
            var propertyValue = selection.css(property);
            propertyTable += "<tr><td>" +property+"</td><td>"+propertyValue+"</td></tr>"; 
        }
        propertyTable += "</table>";
        $('.property-list').html(propertyTable);
    }
    
    
    var searchBySelector = function() {
        var selectorBox = root.find(".selector");
        var selectorStr = selectorBox.val();
        
        var nthBox = root.find('.nth');
        var nth = nthBox.val()
        var propertyFilter = $('.property-filter');
        var filterInput = $('.filterInput');
        var propertyDiv = $('.property-list');
        try {
            if (nth == "") {
                var selection = $(selectorStr).eq(0);
            } else {
                var selection = $(selectorStr).eq(nth);
            }
            var html= selection.html().trim();
            if (html != "") {
                $('.updateHTMLbutton').show();
            } else {
                $('.updateHTMLbutton').hide();
            }
            var styleArray = selection[0].style;
            
            var propertyTable = "<table>";
            for (var key in styleArray) {
                var propertyValue = selection.css(key);
                if (propertyValue!="none" && propertyValue!= "" && propertyValue!=null) {
                    propertyTable += "<tr><td>" +key+"</td><td>"+propertyValue+"</td></tr>"; 
                }
            }
            propertyTable += "</table>";
            propertyDiv.append(propertyTable);
            
            
            
            
            propertyFilter.css({"border-bottom": "1px solid #2C3B63"});
            propertyDiv.animate( {"height": "193px"} , 500 );
            propertyFilter.animate( {"height": "29px"} , 500 );
            filterInput.show();
            $('.unfilterButton').hide();
            $(".filterButton").bind('click', function() {
                $('.unfilterButton').show();
                var filterWord = $('.filterWord').val();
                var newPropertyTable = "table";
                for (var key in styleArray) {
                    var propertyValue = selection.css(key);
                    if (propertyValue!="none" && propertyValue!= "" && propertyValue!=null) {
                        if (key.indexOf(filterWord)>=0) {
                            
                            newPropertyTable += "<tr><td>" +key+"</td><td>"+propertyValue+"</td></tr>"; 
                        }
                    }
                }
                newPropertyTable += "</table>";
                propertyDiv.empty()
                propertyDiv.append(newPropertyTable);
            });
            
            
            $(".unfilterButton").bind('click', function() {
                var newPropertyTable = "<table>";
                for (var key in styleArray) {
                    var propertyValue = selection.css(key);
                    if (propertyValue!="none" && propertyValue!= "" && propertyValue!=null) {
                        newPropertyTable += "<tr><td>" +key+"</td><td>"+propertyValue+"</td></tr>"; 
                    }
                }
                newPropertyTable += "</table>";
                propertyDiv.empty();
                propertyDiv.append(newPropertyTable);
                $(this).hide();
            });
            
            $('.updateHTMLbutton').bind('click', function() {
                selection.html(textEditor.val());
                var styleArray = selection[0].style;
            
                var propertyTable = "<table>";
                for (var key in styleArray) {
                    var propertyValue = selection.css(key);
                    if (propertyValue!="none" && propertyValue!= "" && propertyValue!=null) {
                        propertyTable += "<tr><td>" +key+"</td><td>"+propertyValue+"</td></tr>"; 
                    }
                }
                propertyTable += "</table>";
                propertyDiv.append(propertyTable);
            });
        } catch (err) {
            var html="Element not found."
            
            
            $('.unfilterButton').hide();
            propertyFilter.animate({"height":"0px"},500, function() {
                propertyFilter.css({"border-bottom": "none"});
                $('.updateHTMLbutton').hide();
                filterInput.hide();
            });
            propertyDiv.animate( {"height": "222px"} , 500, function() {
                propertyDiv.empty();
            });
            
        }
        var textEditor = root.find(".text-editor");
        textEditor.val(html);
        
        
       
    };
  /*
   * Construct the UI
   */
    exports.initialize = function() {
        root = $("<div class='inspector'></div>").appendTo($('body'));
        $('body').css("margin-top", "315px");
        $('body').css("background-position-y", "315px");
        root.append(template)
        root.find(".handle").bind("click", toggle);
        root.find(".node-lookup button").on("click", searchBySelector);
        $('.node-lookup').css("color", "#000000");
        $('.property-editor').css("color", "#000000");
        $('.filterInput').hide();
        $('.updateHTMLbutton').hide();
    };
  
    return exports;
};

/*****************************************************************************
 * Boot up the web inspector!
 *
 * This will enable you to COPY AND PASTE this entire file into any web page
 * to inspect it.
 *
 * XXX TODO!
 *  Change the CSS link below to point to the full URL of your CSS file!
 *
 *  You shouldn't need to touch anything else below.
 *
 *****************************************************************************/
(function() {
    var createInspector = function() {
      window.inspector = Inspector(jQuery);
      window.inspector.initialize();
    }

    // Add the CSS file to the HEAD
    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', 'web-inspector.css'); // XXX TODO CHANGEME!!
    document.head.appendChild(css);

    if ('jQuery' in window) {
      createInspector(window.jQuery);
    } else {
      // Add jQuery to the HEAD and then start polling to see when it is there
      var scr = document.createElement('script');
      scr.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
      document.head.appendChild(scr);
      var t = setInterval(function() {
        if ('jQuery' in window) {
          clearInterval(t); // Stop polling 
          createInspector();
        }
      }, 50);
    }
})();

(function(){

    var customPostTypes = mytinymceplugin_vars.custom_post_types; // load data from footnotes.php
    console.log(customPostTypes)
    
    tinymce.create('tinymce.plugins.MyPluginName', {
        init: function(ed, url){      

        var resultsContainer = {
            type: 'container',
            name: 'resultsContainer',
            label: 'Results',
            content_style: 'max-width: 600px;',
            html: '<div id="results">Loading results...</div>',
            onclick: function(e) {
                
                const list = document.getElementById('list');
                const inputField = document.getElementById('input-field');
                const target = e.target;
                // const id = target.getAttribute('data-id'); // title ID 
                const id = target.getAttribute('data-post-id'); // post ID

                if (inputField.value) {
                // if the input field already has a value, append the new ID to the existing value
                inputField.value += ',' + id;
                } else {
                // otherwise, set the value to the new ID directly
                inputField.value = id;
                }

                const ids = inputField.value.split(','); // Split the input value into an array of IDs
                const uniqueIds = [...new Set(ids)]; // Remove duplicates using Set
                uniqueIds.sort(); // Sort the array of unique IDs
                inputField.value = uniqueIds.join(','); // Join the sorted array of unique IDs into a comma-separated string and set it as the new value of the input field

            }
        };

        var resultsItems = []

        var data = customPostTypes;

        var footnotes = data.map(function(d) {
            return "<li  data-post-id="+ d.postid +"><span class=\"fn-id\">"+ d.id +"</span><b class=\"fn-post-id\">"+ d.postid +"</b>" + d.title + "</li>";
        });

        var footnotesClean = data.map(function(d) {
            return '<div>'+d.title+'</div>';
        });
        
        resultsContainer.html = '<div id="results"><ul id="list">' + footnotes.join('') + '</ul></div>';
        resultsItems = footnotesClean.join('')

        ed.on('click', function(e) {
            console.log(e.target.nodeName);
            if (e.target.nodeName === 'LI') {
                var inputField = document.querySelector('#inputField');
                // var id = e.target.getAttribute('data-id'); // the title id of the footnote
                var id = e.target.getAttribute('data-post-id'); // the real id of the footnote
                inputField.value = id;
            }
        });
        
        ed.addButton('myblockquotebtn', {
          title: 'Footnotes',
          cmd: 'myBlockquoteBtnCmd',
          image: url + '/img/favicon.png'
        });
        ed.addCommand('myBlockquoteBtnCmd', function(){
        var selectedText = ed.selection.getContent({format: 'html'});

        var bodyFields = [
            {
                type: 'container',
                name: 'searchContainer',
                label: 'Search',
                content_style: 'max-width: 600px;',
                html: '<input type="search" id="searchInput" placeholder="Search">',
                onkeyup: function(e) {

                    var input, filter, ul, li, i, txtValue;
                    input = document.getElementById("searchInput");
                    filter = input.value.toUpperCase();
                    ul = document.querySelector("#results ul");
                    li = ul.getElementsByTagName("li");
                    for (i = 0; i < li.length; i++) {
                        txtValue = li[i].textContent || li[i].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        li[i].style.display = "";
                        } else {
                        li[i].style.display = "none";
                        }
                    }

                }
            }, 
            resultsContainer,
            {
                type: 'textbox',
                name: 'author',
                label: 'Footnote ID\'s',
                id: 'input-field',
                value: ''
            },
                       
        ];

        var win = ed.windowManager.open({
            title: 'Footnotes',
            body: bodyFields,
            buttons: [
              {
                text: "Ok",
                subtype: "primary",
                onclick: function() {
                  win.submit();
                }
              },
              {
                text: "Cancel",
                onclick: function() {
                  win.close();
                }
              }
            ],
            onsubmit: function(e){
            var params = [];
            if( e.data.author.length > 0 ) {
                params.push('id="' + e.data.author + '"');
            }   
            if( params.length > 0 ) {
                paramsString = ' ' + params.join(' ');
            }
            // var returnText = '[fn' + paramsString + ']' + selectedText + '[/fn]';
            var returnText = '[fn word='+ selectedText +'' + paramsString + ']';
            ed.execCommand('mceInsertContent', 0, returnText);
            }
          });
        });
      },
      getInfo: function() {
        return {
          longname : 'Footnotes',
          author : 'Benjamin el Barakat',
          authorurl : 'https://minimalcode.nl',
          version : "1.0"
        };
      }
    });
    tinymce.PluginManager.add( 'mytinymceplugin', tinymce.plugins.MyPluginName );
})();





var basicRequestObject = {
    "xml_command":"listLib",
    "pw":"",
    "course_password":'change-me',
    "session_key":'change-me',
    "user":"user-needs-to-be-defined",
    "library_name":"Library",
    "courseID":'change-me',
    "set":"set0",
    "new_set_name":"new set",
    "command":"buildtree"
};

var basicWebserviceURL = "/webwork2/instructorXMLHandler";
var tagify;


$(window).load(function() {


   //setCookie('tabber', 0);
   var input1 = document.querySelector('input[name=search_bpl]');
   if($('[name="bbrowse_which"]').val() == 'browse_spcf_library' ) {
       if($('[name="library_lib"] option:selected').index() == 0) {
           $("#lib_view_spcf").attr("disabled","disabled");
       }
   }

  
   if(!input1) { 
       var brw = $('[name="bbrowse_which"]').val();
       if(brw == 'browse_spcf_library') {
          $('a:contains("'+maketext('Solution')+'")').hide();
          $('a:contains("'+maketext('Hint')+'")').hide();
       }
       return;
   }
   tagify = bpl_reset(null,0);
   //alert(input1.val());
   $("#blibrary_subjects").change ( function() {
       tagify = bpl_reset(tagify,1);
       blib_update('chapters', 'get', tagify, 'BPL' );
       lib_searchops("BPL",tagify);
       blib_update('count', 'clear', tagify, 'BPL' );

       $("#library_defkeywords").val(20);
       lib_top20keywords("BPL",tagify);
       return true;
   });

   $("#blibrary_chapters").change ( function() {
       tagify = bpl_reset(tagify,1);
       lib_searchops("BPL",tagify);
       blib_update('count', 'clear', tagify, 'BPL' );
       $("#library_defkeywords").val(20);
       lib_top20keywords("BPL",tagify);
       return true;
   });

  lib_searchops("BPL",tagify);
  $("#search_bpl").hide();
  $('input[name=reset]').click(function() {
       var brw = $('[name="bbrowse_which"]').val();
       var k = 0;
       if(brw == 'browse_spcf_library') {
           k = 5;
       }
       f_reset(k);
       return false;
  });
  $("#load_kw").click(function() {
       f_loadmore();
       return false;
  });
  //var x = tabberAutomatic(tabberOptions);
  //alert(typeof(x));

  //hide solutions and hints to be toggled
  if($("input[name='showSolutiont']").is(':checked')) {
      $('a:contains("'+maketext('Solution')+'")').show();
  } else {
      $('a:contains("'+maketext('Solution')+'")').hide();
  }
  if($("input[name='showHintt']").is(':checked')) {
      $('a:contains("'+maketext('Hint')+'")').show();
  } else {
      $('a:contains("'+maketext('Hint')+'")').hide();
  }

  //OPL Advanced search handle
  $("#library_advanced").click(function (event) {
        var txt = $(this).val();
        if(txt == maketext('Basic Search')) {
            $(this).val(maketext('Advanced Search'));
            $('[name="library_adv_btn"]').val('');
            //change index
            $('[name="library_textbook"]').prop("selectedIndex",0);
            $('[name="library_textbook"]').trigger( "change" );
            
            //lib_update('count','clear');
        } else {
            $('[name="library_adv_btn"]').val('1');
            $(this).val(maketext('Basic Search'));
        }
        $('#opladv tr.opladvsrch').toggle();
        $('#opladv td.opladvsrch').toggle();
        event.preventDefault();
   });

});
function f_loadmore() {


       //alert('Load more keywords');
       var k = parseInt($("#library_defkeywords").val()) + 20;
       
       $("#library_defkeywords").val(k);
       lib_top20keywords("BPL",tagify);
       return false;

}

function f_reset(v) {

       //location.href = location.href;
       //return false;
       nomsg();

       $('#showHintt').prop('checked', false);
       $('#showSolutiont').prop('checked', false);

       $('[name="library_subjects"]').prop("selectedIndex",0);
       lib_update('chapters', 'clear');
       lib_update('count', 'clear' );
       $('[name="llibrary_sets"]').prop("selectedIndex",0);
       $('[name="mlibrary_sets"]').prop("selectedIndex",0);
       $('[name="slibrary_sets"]').prop("selectedIndex",0);
         //  return;
       tagify = bpl_reset(tagify,1);
       //blib_update('subjects', 'clear', tagify, 'BPL' );
       $('[name="blibrary_subjects"]').prop("selectedIndex",0);
       blib_update('chapters', 'clear', tagify, 'BPL' );
       blib_update('count', 'clear', tagify, 'BPL' );
       lib_searchops("BPL",tagify);

       $("#library_defkeywords").val(20);
       $("#lib_deftab").val(v);
       lib_top20keywords("BPL",tagify);

       //reset spdir tab
       //if(v == 5) {
           $('[name="library_lib"]').prop("selectedIndex",0);
           //$('[name="library_dir"]').prop("selectedIndex",0);
           //$('[name="library_subdir"]').prop("selectedIndex",0);
           $("#lib_view_spcf").attr("disabled","disabled");
           dir_update('dir', 'clear', tagify, 'BPL' );
           //dir_update('count', 'clear', tagify, 'BPL' );
       //}

       $(".showResultsMenu").hide().css("visibility", "hidden");
       $('#showResults').hide().css("visibility", "hidden");
       //$(".lb-problem-header").css("visibility", "hidden");
       $(".lb-problem-header").css("display", "none");
       //$(".RenderSolo").css("visibility", "hidden");
       $(".RenderSolo").css("display", "none");
       $(".lb-mlt-group").css("visibility", "hidden");
       $(".AuthorComment").css("display", "none");
       $('#showResultsEnd').hide().css("visibility", "hidden");
}
function bpl_reset(tg,rs) {
       var input1 = document.querySelector('input[name=search_bpl]');
       if(rs)
         input1.value = '';
       if(tg)
         tg.destroy();
       tagify = new Tagify(input1, {
           suggestionsMinChars : 1, autocomplete: 1,
       });
       tagify.on('add', ()=>{
           blib_update('count', 'clear', tagify, 'BPL' );
           $("#library_defkeywords").val(20);
           lib_top20keywords('BPL',tagify);
           //lib_searchops('BPL',tagify);
       });
       tagify.on('remove', ()=>{
           blib_update('count', 'clear', tagify, 'BPL' );
           //lib_searchops('BPL',tagify);
           $("#library_defkeywords").val(20);
           lib_top20keywords('BPL',tagify);
       });
       blib_update('count', 'clear', tagify, 'BPL' );
       lib_top20keywords('BPL',tagify);
       return tagify;
}


function toggleSolution(t) {
    if (t.is(':checked')) {
         $('a:contains('+maketext('Solution')+')').show();
    } else {
         $('a:contains('+maketext('Solution')+')').hide();
    }
}
function toggleHint(t) {
    if (t.is(':checked')) {
         $('a:contains('+maketext('Hint')+')').show();
    } else {
         $('a:contains('+maketext('Hint')+')').hide();
    }
}

// Messaging
function nomsg() {
  $(".Message").html("");
}

function goodmsg(msg) {
  $(".Message").html('<div class="ResultsWithoutError">'+msg+"</div>");
}

function badmsg(msg) {
  $(".Message").html('<div class="ResultsWithError">'+msg+"</div>");
}

function settoggle(id, text1, text2) {
  $('#'+id).toggle(function() {$('#'+id).html(text2)}, 
    function() {$('#'+id).html(text1)});
  return true;
}

function toggle_content(id, text1, text2) {
  var e = $('#'+id);
  nomsg();
  if(e.text() == text1)
    e.text(text2);
  else
    e.text(text1);
  return true;
}

function togglepaths() {
  var toggle_from = $('#toggle_path_current')[0].value;
  var new_text = $('#showtext');
  nomsg();
  if(toggle_from == 'show') {
    new_text = $('#hidetext')[0].value;
    $('#toggle_path_current').val('hide');
	$("[id*=filepath]").each(function() {
		// If showing, trigger
		if(this.textContent.match(show_string)) {	  
		this.click();
	    }
	});
  } else {
    new_text = $('#showtext')[0].value;
    $('#toggle_path_current').val('show');
	$("[id*=filepath]").each(function() {
		// If hidden, trigger
		if(! this.textContent.match(show_string)) {
		  this.click();
		}
	});
  }
  $('#toggle_paths').prop('value',new_text);
  return false;
}

function init_webservice(command) {
  var myUser = $('#hidden_user').val();
  var myCourseID = $('#hidden_courseID').val();
  var mySessionKey = $('#hidden_key').val();
  var mydefaultRequestObject = {
        };
  _.defaults(mydefaultRequestObject, basicRequestObject);
  if (myUser && mySessionKey && myCourseID) {
    mydefaultRequestObject.user = myUser;
    mydefaultRequestObject.session_key = mySessionKey;
    mydefaultRequestObject.courseID = myCourseID;
  } else {
    alert("missing hidden credentials: user "
      + myUser + " session_key " + mySessionKey+ " courseID "
      + myCourseID, "alert-error");
    return null;
  }
  mydefaultRequestObject.xml_command = command;
  return mydefaultRequestObject;
}

function lib_update(who, what, tg, typ) {
  var child = { subjects : 'chapters', chapters : 'sections', sections : 'count'};

  //nomsg();
  var all = 'All ' + capFirstLetter(who);
  all = maketext(all);

  var mydefaultRequestObject = init_webservice('searchLib');
  if(mydefaultRequestObject == null) {
    // We failed
    // console.log("Could not get webservice request object");
    return false;
  }

  typ = 'OPL';

  var subj = $('[name="library_subjects"] option:selected').val();
  var chap = $('[name="library_chapters"] option:selected').val();
  var sect = $('[name="library_sections"] option:selected').val();

  var subjind = $('[name="library_subjects"] option:selected').index();
  var chapind = $('[name="library_chapters"] option:selected').index();
  var sectind = $('[name="library_sections"] option:selected').index();

  if(subjind == 0) { subj = '';};
  if(chapind == 0) { chap = '';};
  if(sectind == 0) { sect = '';};

  var lib_text = $('[name="library_textbook"] option:selected').val();
  var lib_textchap = $('[name="library_textchapter"] option:selected').val();
  var lib_textsect = $('[name="library_textsection"] option:selected').val();

  var lib_textind = $('[name="library_textbook"] option:selected').index();
  var lib_textchapind = $('[name="library_textchapter"] option:selected').index();
  var lib_textsectind = $('[name="library_textsection"] option:selected').index();

  if(lib_textind == 0) { lib_text = '';};
  if(lib_textchapind == 0) { lib_textchap = '';};
  if(lib_textsectind == 0) { lib_textsect = '';};

  mydefaultRequestObject.library_subjects = subj;
  mydefaultRequestObject.library_chapters = chap;
  mydefaultRequestObject.library_sections = sect;
  mydefaultRequestObject.library_srchtype = typ;

  mydefaultRequestObject.library_textbooks = lib_text;
  mydefaultRequestObject.library_textchapter = lib_textchap;
  mydefaultRequestObject.library_textsection = lib_textsect;
  if(who == 'count') {
    mydefaultRequestObject.command = 'countDBListings';
    // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
			   reportWWerror(data);		   
		       }

		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       arr = arr[0];
		       var line = maketext("There are") + " " + arr + " " + maketext("matching WeBWorK problems")
		       if(arr == "1") {
			   line = maketext("There is 1 matching WeBWorK problem")
		       }
		       $('#library_count_line').html(line);
                       //if(typ == 'BPL')
                       //    lib_searchops('BPL',tg);
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
      
  }
  var subcommand = "getAllDBchapters";
  if(what == 'clear') {
    setselect('library_'+who, [all]);
    return lib_update(child[who], 'clear' , tg , typ);
  }
  if(who=='chapters' && subj=='') { return lib_update(who, 'clear'); }
  if(who=='sections' && chap=='') { return lib_update(who, 'clear'); }
  if(who=='sections') { subcommand = "getSectionListings";}
  mydefaultRequestObject.command = subcommand;
  // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
		       	   reportWWerror(data);
		       }

		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       arr.splice(0,0,all);
		       setselect('library_'+who, arr);
		       lib_update(child[who], 'clear', tg);
                       //if(typ == 'BPL')
                       //    lib_searchops('BPL',tg);
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
}
function blib_update(who, what, tg, typ) {
  var child = { subjects : 'chapters', chapters : 'sections', sections : 'count'};

  //nomsg();
  var all = 'All ' + capFirstLetter(who);
  all = maketext(all);
  

  var mydefaultRequestObject = init_webservice('searchLib');
  if(mydefaultRequestObject == null) {
    // We failed
    // console.log("Could not get webservice request object");
    return false;
  }

  typ = 'BPL';

  var subj = $('[name="blibrary_subjects"] option:selected').val();
  var chap = $('[name="blibrary_chapters"] option:selected').val();
  var subjind = $('[name="blibrary_subjects"] option:selected').index();
  var chapind = $('[name="blibrary_chapters"] option:selected').index();
  var keywd = $('[name="search_bpl"]').val();

  if(subjind == 0) { subj = '';};
  if(chapind == 0) { chap = '';};
  //if(sect == 'All Sections') { sect = '';};

  mydefaultRequestObject.blibrary_subjects = subj;
  mydefaultRequestObject.blibrary_chapters = chap;
  mydefaultRequestObject.library_subjects = subj;
  mydefaultRequestObject.library_chapters = chap;
  mydefaultRequestObject.library_srchtype = typ;
  mydefaultRequestObject.library_keywords = keywd;

  if(who == 'count') {
    mydefaultRequestObject.command = 'countDBListings';
    // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
			   reportWWerror(data);		   
		       }

		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       arr = arr[0];
		       var line = maketext("There are") + " " + arr + " " + maketext("matching WeBWorK problems")
		       if(arr == "1") {
			   line = maketext("There is 1 matching WeBWorK problem")
		       }
		       $('#blibrary_count_line').html(line);
                       //if(typ == 'BPL')
                       //    lib_searchops('BPL',tg);
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
      
  }
  var subcommand = "getAllDBchapters";
  if(what == 'clear') {
    setselect('blibrary_'+who, [all]);
    return blib_update(child[who], 'clear' , tg , typ);
  }
  if(who=='chapters' && subj=='') { return blib_update(who, 'clear'); }
  if(who=='sections' && chap=='') { return blib_update(who, 'clear'); }
  if(who=='sections') { subcommand = "getSectionListings";}
  mydefaultRequestObject.command = subcommand;
  // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
		       	   reportWWerror(data);
		       }

		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       arr.splice(0,0,all);
		       setselect('blibrary_'+who, arr);
		       blib_update(child[who], 'clear', tg);
                       //if(typ == 'BPL')
                       //    lib_searchops('BPL',tg);
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
}
function dir_update(who, what ) {
  var child = { lib : 'dir', dir : 'subdir', subdir : 'count'};
  var childe = { lib : 'libraries', dir : 'directories', subdir : 'subdirectories', count : ''};

  //nomsg();
  var all = 'All '+ capFirstLetter(childe[who]);
  all = maketext(all);

  var mydefaultRequestObject = init_webservice('searchLib');
  if(mydefaultRequestObject == null) {
    // We failed
    // console.log("Could not get webservice request object");
    return false;
  }
  if(who == 'dir' && what == 'get') {
      $('[name="library_dir"]').prop("selectedIndex",0);
      $('[name="library_subdir"]').prop("selectedIndex",0);
  }
  if(who == 'subdir' && what == 'get') {
      $('[name="library_subdir"]').prop("selectedIndex",0);
  }
  var lib    = $('[name="library_lib"] option:selected').val();
  var dir    = $('[name="library_dir"] option:selected').val();
  var subdir = $('[name="library_subdir"] option:selected').val();

  var libind    = $('[name="library_lib"] option:selected').index();
  var dirind    = $('[name="library_dir"] option:selected').index();
  var subdirind = $('[name="library_subdir"] option:selected').index();
  var topdir = $('[name="library_topdir"]').val();


  if(libind == 0) { lib = '';};
  if(dirind == 0) { dir = '';};
  if(subdirind == 0) { subdir = '';};

  topdir = topdir+'/'+lib+'/'+dir+'/'+subdir;

  mydefaultRequestObject.library_topdir = topdir;
  //mydefaultRequestObject.library_lib = lib;
  //mydefaultRequestObject.library_dir = dir;
  //mydefaultRequestObject.library_subdir = subdir;
  if(who == 'dir' && what == 'get' && $('[name="library_lib"] option:selected').index() > 0) {
      $("#lib_view_spcf").removeAttr("disabled");
  } else {
      if($('[name="library_lib"] option:selected').index() == 0) {
          $("#lib_view_spcf").attr("disabled","disabled");
      }
  }


  if(who == 'count') {
    mydefaultRequestObject.command = 'countDirListings';
    // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
			   reportWWerror(data);		   
		       }

		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       arr = arr[0];
		       var line = maketext("There are") + " " + arr + " " + maketext("matching WeBWorK problems")
		       if(arr == "1") {
			   line = maketext("There is 1 matching WeBWorK problem")
		       }
                       if($("select[name='library_lib'] option:selected").index() == 0) {
                             line = '';
                       }
		       $('#slibrary_count_line').html(line);
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
      
  }  
  if(what == 'clear') {
    setselect('library_'+who, [all]);
    return dir_update(child[who], 'clear');
  }

 
  if(who=='dir' && lib=='') { return dir_update(who, 'clear'); }
  if(who=='subdir' && dir=='') { return dir_update(who, 'clear'); }

  var subcommand = "getAllDirs";
  if(what == 'clear') {
    setselect('library_'+who, [all]);
    return dir_update(child[who], 'clear' );
  }
  //if(who=='lib' && lib=='') { return dir_update(who, 'clear'); }
  //if(who=='dir' && dir=='') { return dir_update(who, 'clear'); }
  if( who == 'dir' || who=='subdir') { subcommand = "getAllDirs";}
  mydefaultRequestObject.command = subcommand;
  // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
		       	   reportWWerror(data);
		       }

		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       arr.splice(0,0,all);
		       setselect('library_'+who, arr);
		       dir_update(child[who], 'clear');
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
}
function lib_searchops(lib,tg) {

  //nomsg();
  var mydefaultRequestObject = init_webservice('searchLib');
  if(mydefaultRequestObject == null) {
    // We failed
    // console.log("Could not get webservice request object");
    return false;
  }
  //var keyp = $('input#search_bpl').val();
  //var keyp = str;
  var subj = $('[name="blibrary_subjects"] option:selected').val();
  var chap = $('[name="blibrary_chapters"] option:selected').val();

  var subjind = $('[name="blibrary_subjects"] option:selected').index();
  var chapind = $('[name="blibrary_chapters"] option:selected').index();

  if(subjind == 0) { subj = '';};
  if(chapind == 0) { chap = '';};

  var keywd = $('[name="search_bpl"]').val();

  //mydefaultRequestObject.library_keywords = keyp;
  mydefaultRequestObject.library_subjects = subj;
  mydefaultRequestObject.library_chapters = chap;
  mydefaultRequestObject.library_keywords = keywd;

  var subcommand = "getAllKeywords";

  mydefaultRequestObject.command = subcommand;
  // console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
		       	   reportWWerror(data);
		       }

		       var response = $.parseJSON(data);
		       console.log(response);
		       var arr = response.result_data;
		       arr.splice(0,0);
		       setkeywords( arr,tg);
                       return arr;
		       //return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
}

function setkeywords(arr,tg) {

  tg.settings.whitelist = arr;
  tg.settings.enforeWhitelist    = true;
  tg.DOM.datalist = tg.buildDataList();
  lib_top20keywords("BPL",tg);

}

function keywordclick(tg,ar) {

   $(".keyword").click( function() {
        kw = $(this).attr("keyword");
        var tags = $("input#search_bpl").val();

        $("input#search_bpl").val(tags+','+kw);
        $("input#search_bpl").trigger("input");
        tg.addTag(kw);
        blib_update('count', 'clear', tagify, 'BPL' );
        var ir = ar.indexOf(kw);
        if(ir > -1) 
            ar.splice(ir,1);
        settop20keywords(ar,tg);

    });
}

function lib_top20keywords (lib,tg) {

  //nomsg();
  var mydefaultRequestObject = init_webservice('searchLib');
  if(mydefaultRequestObject == null) {
    // We failed
    // console.log("Could not get webservice request object");
    return false;
  }
  var subj = $('[name="blibrary_subjects"] option:selected').val();
  var chap = $('[name="blibrary_chapters"] option:selected').val();
  var tags = $("input#search_bpl").val();
  var kwn  = $("input#library_defkeywords").val();

  var subjind = $('[name="blibrary_subjects"] option:selected').index();
  var chapind = $('[name="blibrary_chapters"] option:selected').index();

  if(subjind == 0) { subj = '';};
  if(chapind == 0) { chap = '';};

  mydefaultRequestObject.library_subjects = subj;
  mydefaultRequestObject.library_chapters = chap;
  mydefaultRequestObject.library_keywords = tags;
  mydefaultRequestObject.library_defkeywords = kwn;
  //mydefaultRequestObject.library_srchtype = 'top20';

  var subcommand = "getTop20KeyWords";

  mydefaultRequestObject.command = subcommand;
   console.log(mydefaultRequestObject);
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: mydefaultRequestObject,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
		       	   reportWWerror(data);
		       }

		       var response = $.parseJSON(data);
		       console.log(response);
		       var arr = response.result_data;
		       arr.splice(0,0);
		       settop20keywords( arr, tg);
                       //return arr;
		       return true;
		   },
		  error: function (data) {
		      alert(basicWebserviceURL+': '+data.statusText);
		  },
		  });
}
function settop20keywords(arr,tg) {

   //Add the keywords to div kword
   var kwRows = '<div align="left" style="line-height: .8em;">';
   var arrayLength = arr.length;
   var tags = $("input#search_bpl").val();
   var tarr = tags.split(',');
    
   var wd = 0;
   for (var i = 0; i < arrayLength; i++)
   {
        // Do something
        //Check if arr[i] is already in tags
        if($.inArray(arr[i], tarr) > -1) {
          continue; 
        }
        wd += arr[i].length;
        kwRows += '<span id="keyword" class="keyword" keyword="'+arr[i]+'" style="font-size: 13px; line-height: 200%;">'+arr[i]+'</span> ';
        if(wd > 100) { 
           kwRows += '<br />';
           wd = 0;
        }
        
   }
   kwRows += '</div>';
   document.getElementById("kword").innerHTML = kwRows;keywordclick(tg,arr);
   if(arrayLength < parseInt($("#library_defkeywords").val())) {
      $("#load_kw").hide();
   } else {
      $("#load_kw").show();
   }

}
function onRemoveTag(e){
    blib_update('count', 'clear', e, 'BPL' );
}

function onAddTag(e){
    blib_update('count', 'clear', e, 'BPL' );
}

function setselect(selname, newarray) {
  var sel = $('[name="'+selname+'"]');
  sel.empty();
  $.each(newarray, function(i,val) {
    sel.append($("<option></option>").val(val).html(val));
  });
}

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addme(path, who, selectsetstring) {
  nomsg();
  var target = $('[name="local_sets"] option:selected').val();
  if(target == selectsetstring) {
    alert(maketext("You need to pick a target set above so we know what set to which we should add this problem."));
    return true;
  }
  var mydefaultRequestObject = init_webservice('addProblem');
  if(mydefaultRequestObject == null) {
    // We failed
	badmsg("Could not connect back to server");
    return false;
  }
  mydefaultRequestObject.set_id = target;
  var pathlist = new Array();
  if(who=='one') {
    pathlist.push(path);
  } else { // who == 'all'
    var allprobs = $('[name^="filetrial"]');
    for(var i=0,len =allprobs.length; i< len; ++i) {
      pathlist.push(allprobs[i].value);
    }
  }
  mydefaultRequestObject.total = pathlist.length;
  mydefaultRequestObject.set = target;
  addemcallback(basicWebserviceURL, mydefaultRequestObject, pathlist, 0)(true);
}

function addemcallback(wsURL, ro, probarray, count) {
  if(probarray.length==0) {
    return function(data) {
	if (data.match(/WeBWorK error/)) {
	    reportWWerror(data);
	}
	
	//var phrase = count+" problem";
	//if(count!=1) { phrase += "s";}
	// alert("Added "+phrase+" to "+ro.set);
	markinset();

	var prbs = pluralise("problem","problems",count);
	//if(ro.total == 1) { 
	 //   prbs = "problem";
	//}
	goodmsg(maketext("Added") + " "+ro.total+" "+prbs+" " + maketext("to set")+" "+ro.set_id);

	return true;
    };
  }
  // Need to clone the object so the recursion works
  var ro2 = jQuery.extend(true, {}, ro);
  ro2.problemPath=probarray.shift();
  return function (data) {
      return $.ajax({type:'post',
		     url: wsURL,
		     data: ro2,
		     timeout: 10000, //milliseconds
		     success: addemcallback(wsURL, ro2, probarray, count+1),
		     error: function (data) {
			 alert(wsURL+': '+data.statusText);
		     },
		    });
      
  };
}

// Reset all the messages about who is in the current set
function markinset() {
  var ro = init_webservice('listSetProblems');
  var target = $('[name="local_sets"] option:selected').val();
  if(target == 'Select a Set from this Course') {
    target = null;
  }
  var shownprobs = $('[name^="filetrial"]'); // shownprobs.value
  ro.set_id = target;
  ro.command = 'true';
    return $.ajax({type:'post',
		   url: basicWebserviceURL,
		   data: ro,
		   timeout: 10000, //milliseconds
		   success: function (data) {
		       if (data.match(/WeBWorK error/)) {
			   reportWWerror(data);
		       }
		       
		       var response = $.parseJSON(data);
		       // console.log(response);
		       var arr = response.result_data;
		       var pathhash = {};
		       for(var i=0; i<arr.length; i++) {
			   arr[i] = arr[i].path;
			   arr[i] = arr[i].replace(/^\//,'');
			   pathhash[arr[i]] = 1;
		       }
		       for(var i=0; i< shownprobs.length; i++) {
			   var num= shownprobs[i].name;
			   num = num.replace("filetrial","");
			   if(pathhash[shownprobs[i].value] ==1) {
			       $('#inset'+num).html('<i><b>(' + maketext("in target set") + ')</b></i>');
			   } else {
			       $('#inset'+num).html('<i><b></b></i>');
			   }
		       }
		   },
		   error: function (data) {
		       alert(basicWebserviceURL+': '+data.statusText);
		   },
		  });
}

function delrow(num) { 
  nomsg();
  var path = $('[name="filetrial'+ num +'"]').val();
  var APLindex = findAPLindex(path);
  var mymlt = $('[name="all_past_mlt'+ APLindex +'"]').val();
  var cnt = 1;
  var loop = 1;
  var mymltM = $('#mlt'+num);
  var mymltMtext = 'L'; // so extra stuff is not deleted
  if(mymltM) {
    mymltMtext = mymltM.text();
  }
  $('#pgrow'+num).remove(); 
  delFromPGList(num, path);
    if((mymlt > 0) && mymltMtext=='M') { // delete hidden problems
    var table_num = num;
    while((newmlt = $('[name="all_past_mlt'+ APLindex +'"]')) && newmlt.val() == mymlt) {
      cnt += 1;
      num++;
      path = $('[name="filetrial'+ num +'"]').val();
      $('#pgrow'+num).remove(); 
      delFromPGList(num, path);
    }
    $('#mlt-table'+table_num).remove();
    } else if ((mymlt > 0) && $('.MLT'+mymlt).length == 0) {
	  $('#mlt-table'+num).remove();
   } else if ((mymlt > 0) && mymltMtext=='L') {
      var new_num = $('#mlt-table'+num+' .MLT'+mymlt+':first')
	   .attr('id').match(/pgrow([0-9]+)/)[1];
      $('#mlt-table'+num).attr('id','mlt-table'+new_num);
      var onclickfunction = mymltM.attr('onclick').replace(num,new_num);
      mymltM.attr('id','mlt'+new_num).attr('onclick', onclickfunction);
	  var insetel = $('#inset'+new_num);
      insetel.next().after(mymltM).after(" ");
      var classstr = $('#pgrow'+new_num).attr('class')
	  .replace('MLT'+mymlt,'NS'+new_num);
      $('#pgrow'+new_num).attr('class',classstr);
   }
  // Update various variables in the page
  var n1 = $('#lastshown').text();
  var n2 = $('#totalshown').text();
  $('#lastshown').text(n1-1);
  $('#totalshown').text(n2-1);
  var lastind = $('[name="last_index"]');
  lastind.val(lastind.val()-cnt);
  var ls = $('[name="last_shown"]').val();
  ls--;
  $('[name="last_shown"]').val(ls);
  if(ls < $('[name="first_shown"]').val()) {
    $('#what_shown').text('None');
  }
//  showpglist();
  return(true);
}

function findAPLindex(path) {
  var j=0;
  while ($('[name="all_past_list'+ j +'"]').val() != path && (j<1000)) {
    j++;
  }
  if(j==1000) { alert("Cannot find "+path);}
  return j;
}

function delFromPGList(num, path) {
  var j = findAPLindex(path);
  j++;
  while ($('[name="all_past_list'+ j +'"]').length>0) {
    var jm = j-1;
    $('[name="all_past_list'+ jm +'"]').val($('[name="all_past_list'+ j +'"]').val());
    $('[name="all_past_mlt'+ jm +'"]').val($('[name="all_past_mlt'+ j +'"]').val());
    j++;
  }
  j--;
  // var v = $('[name="all_past_list'+ j +'"]').val();
  $('[name="all_past_list'+ j +'"]').remove();
  $('[name="all_past_mlt'+ j +'"]').remove();
  return true;
}

function randomize(filepath, el) {
  nomsg();
  var seed = Math.floor((Math.random()*10000));
  var ro = init_webservice('renderProblem');
  ro.problemSeed = seed;
  ro.problemPath = filepath;
  ro.set = ro.problemPath;
  var showhint = 0;
  if($("input[name='showHints']").is(':checked')) { showhint = 1;}
  var showsoln = 0;
  if($("input[name='showSolutions']").is(':checked')) { showsoln = 1;}
  ro.showHints = showhint;
  ro.showSolutions = showsoln;
  ro.processAnswers = 0;
  var displayMode = $('[name="original_displayMode"]').val();
  if(displayMode != 'None') {
    ro.displayMode = displayMode;
  }
  ro.noprepostambles = 1;
  $.ajax({type:'post',
	  url: basicWebserviceURL,
	  data: ro,
	  timeout: 10000, //milliseconds
	  success: function (data) {
	      if (data.match(/WeBWorK error/)) {
		  reportWWerror(data);
	      }
	      var response = data;
	      $('#'+el).html(data);
	      // run typesetter depending on the displaymode
	      if(displayMode=='MathJax')
		  MathJax.Hub.Queue(["Typeset",MathJax.Hub,el]);
	      if(displayMode=='jsMath')
		  jsMath.ProcessBeforeShowing(el);
	      
	      if(displayMode=='asciimath') {
		  //processNode(el);
		  translate();
	      }
	      if(displayMode=='LaTeXMathML') {
		  AMprocessNode(document.getElementsByTagName("body")[0], false);
	      }
 	  },
	  error: function (data) {
	      alert(basicWebserviceURL+': '+data.statusText);
	  },
	 });
    
    return false;
}

function togglemlt(cnt,noshowclass) {
  nomsg();
  var count = $('.'+noshowclass).length;
  var n1 = $('#lastshown').text();
  var n2 = $('#totalshown').text();

  if($('#mlt'+cnt).text()=='M') {
    $('.'+noshowclass).show();
    $('#mlt'+cnt).text("L");
    $('#mlt'+cnt).attr("title","Show less like this");
    count = -1*count;
  } else {
    $('.'+noshowclass).hide();
    $('#mlt'+cnt).text("M");
    $('#mlt'+cnt).attr("title","Show "+$('.'+noshowclass).length+" more like this");
  }
  $('#lastshown').text(n1-count);
  $('#totalshown').text(n2-count);
  $('[name="last_shown"]').val($('[name="last_shown"]').val()-count);
  return false;
}

function showpglist() {
  var j=0;
  var s='';
  while ($('[name="all_past_list'+ j +'"]').length>0) {
    s = s+ $('[name="all_past_list'+ j +'"]').val()+", "+ $('[name="all_past_mlt'+ j +'"]').val()+"\n";
    j++;
  }
  alert(s);
  return true;
}

function reportWWerror(data) {
    
    console.log(data);
    $('<div/>',{class : 'WWerror', title : 'WeBWorK Error'})
	.html(data)
	.dialog({width:'70%'});
}

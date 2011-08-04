// Apache 2.0 J Chris Anderson 2011
$(function() {   
    var path = unescape(document.location.pathname).split('/'),
        design = path[3],
        db = $.couch.db(path[1]);

    function drawItems() {
        db.view(design + "/recent-items", {
            descending : "true",
            limit : 50,
            update_seq : true,
            success : function(data) {
                setupChanges(data.update_seq);
                var them = $.mustache($("#recent-messages").html(), {
                    items : data.rows.map(function(r) {return r.value;})
                });
                $("#content").html(them);
            }
        });
    };
    
    $("li input").live("click", function(e) {
    	var li = $(this).parents("li")
    	var docid = li.attr("id");
        li.toggleClass("checked");
    	db.openDoc(docid, {success : function(doc) {
		    doc.check = e.currentTarget.checked
		    db.saveDoc(doc)
		}});
    });
    
    drawItems();
    var changesRunning = false;
    function setupChanges(since) {
        if (!changesRunning) {
            var changeHandler = db.changes(since);
            changesRunning = true;
            changeHandler.onChange(drawItems);
        }
    }
    
    $("#create-message").couchForm({
        beforeSave : function(doc) {
            var top = $("li:first")[0];
            var newid = top ? top.id : '3';
            doc._id = newid.substr(0,40) + Math.random();
            doc.created_at = new Date();
            doc.check = false;                       
            return doc;
        }
    });
    $("#create-message").find("input").focus();
 });
function(doc) {
  if (doc.created_at) {
      var date = new Date(doc.created_at.replace(/-/g, "/"));
      
      emit(((date.getTime() && date) || new Date(doc.created_at)), {
          text:doc.text,
          check: doc.check,
          id : doc._id
      });
  }
};
define(function(require) {

  var remoteStorageDocuments = require('remotestorage-documents');

  var documents = remoteStorageDocuments.getPrivateList('notes');

  function sync(method, model, options) {
    var resp;

    switch (method) {
      case "read":    resp = model.id !== undefined ? find(model) : findAll(); break;
      case "create":  resp = create(model);                            break;
      case "update":  resp = update(model);                            break;
      case "delete":  resp = destroy(model);                           break;
    }

    if (resp) {
      resp.then(options.success, options.error);
    } else {
      options.error("Record not found");
    }
  }


  function find(model) {
    return documents.get(model.id);
  }

  function findAll() {
    return documents.getAll().
      then(function(objMap) {
        var list = [];
        for(var key in objMap) {
	  list.push(objMap[key]);
        }
        return list;
      });
  }

  function create(model) {
    return documents.add(model.attributes).
      then(function(id) {
        model.set(model.idAttribute, id);
	return model;
      });
  }

  function update(model) {
    return documents.set(model.id, model.attributes).
      then(function() {
        return model;
      });
  }

  function destroy(model) {
    return documents.setContent(model.id, '').then(function() {
      return model;
    });
  }



  return sync;
});

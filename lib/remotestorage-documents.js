define(function(require) {

var remoteStorage = require("remotestorage");


/**
 * File: Documents
 *
 * Maintainer: - Jorin Vogel <hi@jorin.in>
 * Version: -    0.1.3
 *
 * This modue stores lists of documents.
 * A document has the fields title, content and lastEdited.
 *
 */

RemoteStorage.defineModule("documents", function(privateClient, publicClient) {

  /**
   * Schema declaration
   */
  privateClient.declareType("text", {
    "description": "A text document",
    "type":        "object",
    "$schema":     "http://json-schema.org/draft-03/schema#",
    "additionalProperties": true,
    "properties": {
        "title":      { "type": "string",  "required": true },
        "content":    { "type": "string",  "required": true, "default": "" },
        "lastEdited": { "type": "integer", "required": true }
    }
  });


  var documentsModule = {

    /**
     * Method: privateList
     *
     * List all private documents.
     *
     * Parameters:
     *
     *   path - a pathstring where to scope the client to.
     *
     * Returns:
     *   A privateClient scoped to the given path
     *    and extended with the listMethods.
     *   It also supports all <BaseClient methods at http://remotestoragejs.com/doc/code/files/baseclient-js.html>
     */
    privateList: function(path) {
      return privateClient.scope(path + "/").extend(listMethods).cache();
    },

    /**
     * Method: publicList
     *
     * List all public documents.
     *
     * Parameters:
     *
     *   path - a pathstring where to scope the client to.
     *
     * Returns:
     *   A publicClient scoped to the given path
     *    and extended with the listMethods.
     *   It also supports all <BaseClient methods at http://remotestoragejs.com/doc/code/files/baseclient-js.html>
     */
    publicList: function(path) {
      return publicClient.scope(path + "/").extend(listMethods).cache();
    }

  };


  /**
   * Class: listMethods
   *
   */
  var listMethods = {

    /**
     * Method: add
     *
     * Create a new document
     *
     * Parameters:
     *   doc - the document data to store as JSON object.
     *
     * Returns:
     *   A promise, which will be fulfilled with the created document as JSON object.
     *   The created document also contains the newly created id property.
     */
    add: function(doc) {
      var id = privateClient.uuid();
      return this.set(id, doc);
    },

    /**
     * Method: set
     *
     * Update or create a document for a specified id.
     *
     * Parameters:
     *   id  - the id the document is at.
     *   doc - the document data to store as JSON object.
     *
     * Returns:
     *   A promise, which will be fulfilled with the updated document.
     */
    set: function(id, doc) {
      return this.storeObject("text", id, doc).then(function() {
        doc.id = id;
        return doc;
      });
    },

    /**
     * Method: get
     *
     * Get a document.
     *
     * Parameters:
     *   id - the id of the document you want to get.
     *
     * Returns:
     *   A promise, which will be fulfilled with the document as JSON object.
     */
    get: function(id) {
      return this.getObject(id).then(function(obj) {
        return obj || {};
      });
    },

    /**
     * Method: addRaw
     *
     * Store a raw document of the specified contentType at shared/.
     *
     * Parameters:
     *   contentType - the content type of the data (like 'text/html').
     *   data - the raw data to store.
     *
     * Returns:
     *   A promise, which will be fulfilled with the path of the added document.
     */
    addRaw: function(contentType, data) {
      var id = privateClient.uuid();
      var path  = 'shared/' + id;
      var url = this.getItemURL(path);
      return this.storeFile(contentType, path, data).then(function() {
        return url;
      });
    },

    /**
     * Method: setRaw
     *
     * Store a raw doccument of the specified contentType at shared/.
     *
     * Parameters:
     *   id - id of the document to update
     *   contentType - the content type of the data (like 'text/html').
     *   data - the raw data to store.
     *
     * Returns:
     *   A promise, which will be fulfilled with the path of the added document.
     */
    setRaw: function(id, contentType, data) {
      var path  = 'shared/' + id;
      return this.storeFile(contentType, path, data);
    }


  };


  return { exports: documentsModule };

});



return remoteStorage["documents"];

});

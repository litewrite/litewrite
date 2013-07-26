define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var utils = require('utils');


  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function(options) {

      _.bindAll(this, 'filter', 'render', 'update', 'toTop', 'removeItem', 'selectDoc');

      this.app = options.app;
      this.template = _.template(entriesTemplate);

      this.collection
        .on('sort', this.render) // TODO: not sure if sort is the right thing here
        .on('add', this.render)
        .on('change:title', this.update)
        .on('change:lastEdited', this.toTop)
        .on('destroy', this.removeItem);

      this.app.doc.on('change:id', this.selectDoc);

      this.app.state.on('change:query', this.render);

    },

    events: {
      'click .item': 'openDoc'
    },

    // generate opacity for docs and filter them
    serialize: function() {
      var docs = this.collection
        .filter(this.filter).map(function(doc) {
          var res = doc.toJSON();
          res.opacity = doc.getOpacity();
          return res;
        });

      return { docs: docs };
    },

    // check if it matches state.query
    // TODO: filter should only be run if ther is a query. would be faster.
    filter: function(doc) {
      var query = this.app.state.get('query');
      if (query) {
        var reg = new RegExp(utils.escapeRegExp(query), 'i');
        var match = reg.test( doc.get('title') );
        if (!match) return;
      }
      return true;
    },

    render: function() {
      this.$el.html( this.template( this.serialize() ) );
      this.selectDoc();
    },

    find: function(id) {
      return this.$('.item[data-id=' + id + ']');
    },

    // update text and href for a doc
    update: function(doc) {
      var $item = this.find(doc.id).find('a');
      if (!$item.length || doc.isEmpty()) return this.render();
      $item.text( doc.get('title') );
      $item.attr( 'href', '#!' + doc.get('uri') );
    },

    // moves a doc from its current position to the top of the list
    toTop: function(doc) {
      this.$el.prepend( this.removeItem(doc) );
    },

    removeItem: function(doc) {
      return this.find(doc.id).remove();
    },

    // add a 'selected' class to the open doc
    selectDoc: function() {
      if (this.$selected) {
        this.$selected.removeClass('selected');
      }
      this.$selected = this.find( this.app.doc.id )
        .addClass('selected');

      this.scrollToSelected();
    },

    height: function () {
      return this.$el.height() - 50;
    },

    // TODO: test this on mobile
    // scrolls to the selected element
    scrollToSelected: function() {
      var position = this.$selected.position();
      if (!position) return;
      var top = position.top;
      if ( top < 0 || top > this.height() ) {
        this.$el.scrollTop( top - 15 );
      }
    },

    // event handler to open a document
    openDoc: function(e) {
      e.preventDefault();
      var id = this.$(e.currentTarget).attr('data-id');
      this.app.open(id);
      this.trigger('open');
    }

  });



  return EntriesView;
});

var _ = require('underscore')
var Backbone = require('backbone')
var remoteStorage = require('remotestorage')
var AppView = require('./views/app')
var Doc = require('./models/doc')
var Docs = require('./collections/docs')
var State = require('./models/state')

function Litewrite () {
  this.initialize()
}

_.extend(Litewrite.prototype, Backbone.Events, {
  initialize: function () {
    _.bindAll(this, 'loadDoc', 'open', 'openOnCreate', 'updateCurrentDoc', 'handlePrevious', 'updateDocs', 'handleRemoteRemove', 'triggerConnected', 'triggerDisconnected')

    this.state = new State()
    this.doc = new Doc()
    this.docs = new Docs()

    this.doc
      .on('change:content', this.doc.updateLastEdited)
      .on('change:public', this.doc.updateLastEdited)
      .on('change:content', this.doc.updateTitle)
      .on('change:id', this.handlePrevious)
      .on('change:id', this.setUrl)
      .on('change:title', this.setWindowTitle)
      .on('change', this.updateDocs)

    this.state.fetch().always(_.bind(function () {
      this.docs.fetch().always(this.loadDoc)
    }, this))

    this.app = new AppView({ litewrite: this, model: this.doc, collection: this.docs })

    if (window.cordova) {
        remoteStorage.setCordovaRedirectUri('http://litewrite.net/')
    }
    remoteStorage.displayWidget('remotestorage-connect')

    remoteStorage.on('ready', this.triggerConnected)
    remoteStorage.on('disconnected', this.triggerDisconnected)
  },

  loadDoc: function () {
    this.docs
      .on('add', this.openOnCreate)
      .on('remoteUpdate', this.updateCurrentDoc)
      .on('remove', this.handleRemoteRemove)

    this.trigger('ready')
  },

  // open a document. either pass a Doc or an id
  open: function (doc) {
    if (!_.isObject(doc)) doc = this.docs.get(doc) || this.docs.first()
    this.doc.set(doc.toJSON())
  },

  openOnCreate: function (doc) {
    if (doc.isEmpty()) this.open(doc)
  },

  updateCurrentDoc: function (id) {
    if (this.doc.id !== id) return
    this.open(id)
    this.doc.trigger('update')
  },

  // remove empty documents
  handlePrevious: function (doc) {
    var previous = this.docs.get(doc.previous('id'))
    if (previous && previous.isEmpty()) previous.destroy()
  },

  updateDocs: function (doc) {
    this.docs.set(doc.toJSON(), { add: false, remove: false })
  },

  handleRemoteRemove: function (doc, docs, options) {
    var removedLocally = options.success && options.error
    // open first doc so editor doesn't display the removed doc
    if (!removedLocally) this.open()
  },

  triggerConnected: function () {
    this.trigger('connected')
  },

  triggerDisconnected: function () {
    this.trigger('disconnected')
  },

  setWindowTitle: function (doc) {
    document.title = doc.get('title') || 'Litewrite'
  },

  setUrl: function (doc) {
    Backbone.history.navigate(doc.getUrl())
  }

})

module.exports = Litewrite

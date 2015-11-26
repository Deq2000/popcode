var React = require('react');
var classnames = require('classnames');
var i18n = require('i18next-client');

var LibraryPicker = require('./LibraryPicker');
var ProjectList = require('./ProjectList');

var Toolbar = React.createClass({
  propTypes: {
    currentProject: React.PropTypes.object,
    allProjects: React.PropTypes.array,
    onLibraryToggled: React.PropTypes.func.isRequired,
    onNewProject: React.PropTypes.func.isRequired,
    onProjectSelected: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {open: false};
  },

  _close: function() {
    this.setState({open: false, submenu: null});
  },

  _newProject: function() {
    this._close();
    this.props.onNewProject();
  },

  _loadProject: function() {
    this.setState({submenu: 'loadProject'});
  },

  _showHideLabel: function() {
    if (this.state.open) {
      return i18n.t('toolbar.hide');
    }
    return i18n.t('toolbar.show');
  },

  _toggleLibraryPicker: function() {
    return this.setState(function(oldState) {
      if (oldState.submenu === 'libraries') {
        return {submenu: null};
      }
      return {submenu: 'libraries'};
    });
  },

  _getSubmenu: function() {
    switch (this.state.submenu) {
      case 'libraries':
        return (
          <LibraryPicker
            projectKey={this.props.currentProject.projectKey}
            enabledLibraries={this.props.currentProject.enabledLibraries}
            onLibraryToggled={this.props.onLibraryToggled}
          />
        );
      case 'loadProject':
        return (
          <ProjectList
            projects={this.props.allProjects}
            onProjectSelected={this._onProjectSelected}
          />
        );
    }
  },

  _toggleShowHideState: function() {
    this.setState(function(oldState) {
      if (oldState.open) {
        return {open: false, submenu: null};
      }
      return {open: true};
    });
  },

  _onProjectSelected: function(project) {
    this.props.onProjectSelected(project);
    this._close();
  },

  render: function() {
    if (!this.props.currentProject) {
      return null;
    }

    var toolbarItemsClasses = ['toolbar-menu'];
    if (this.state.open) {
      toolbarItemsClasses.push('toolbar-menu--open');
    } else {
      toolbarItemsClasses.push('toolbar-menu--closed');
    }

    return (
      <div className="toolbar">
        <div
          className="toolbar-showHide"
          onClick={this._toggleShowHideState}
        >

          {this._showHideLabel()}
        </div>
        <ul className={classnames(
          'toolbar-menu',
          {
            'toolbar-menu--open': this.state.open,
            'toolbar-menu--closed': !this.state.open,
          }
        )}
        >
          <li onClick={this._newProject} className="toolbar-menu-item">
            {i18n.t('toolbar.new-project')}
          </li>
          <li onClick={this._loadProject}
            className={classnames(
              'toolbar-menu-item',
              {'toolbar-menu-item--active':
                this.state.submenu === 'loadProject'}
            )}
          >
            {i18n.t('toolbar.load-project')}
          </li>
          <li onClick={this._toggleLibraryPicker}
            className={classnames(
              'toolbar-menu-item',
              {'toolbar-menu-item-active': this.state.submenu === 'libraries'}
            )}
          >
            {i18n.t('toolbar.libraries')}
          </li>
        </ul>
        {this._getSubmenu()}
      </div>
    );
  },
});

module.exports = Toolbar;

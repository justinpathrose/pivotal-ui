import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/sidebar';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import '../stylesheets/app.scss';
import 'pivotal-ui/js/prismjs';
import routes from './routes';

const cssRequireContext = require.context('pivotal-ui/css/', true, /\.scss/);
cssRequireContext.keys().map(cssRequireContext);

window.React = React;
window.ReactDOM = ReactDOM;
Object.values(routes).forEach(({pageMetadata: {reactPath}}) => {
  if (!reactPath) return;
  const componentPath = reactPath.split('/').pop();
  const exported = require(`pivotal-ui/react/${componentPath}`);
  Object.entries(exported).forEach(([key, value]) => window[key] = value);
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const path = window.location.pathname.split('/').pop();
    this.state = {content: App.currentContent(path), path};
    this.updateContent = this.updateContent.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', (event) => {
      this.updatePath(event.currentTarget.location);
    }, false);
  }

  updateContent(href) {
    window.history.pushState({}, '', href);
    this.updatePath(window.location);
  }

  updatePath(location) {
    document.body.scrollTop = 0;
    const path = location.pathname.split('/').pop();
    this.setState({content: App.currentContent(path), path});
  }

  static currentContent(path) {
    return routes[path] || routes['404'];
  }

  render() {
    const {path, content: {PageComponent}} = this.state;
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const footer = (
      <Grid className="footer mrn mtxxxl">
        <FlexCol>
          <footer>
            © {year} <a href="https://pivotal.io">Pivotal Software</a>, Inc. All Rights Reserved.
            <span className="pln">
              <span className="policy-link"><a href="https://pivotal.io/privacy-policy">Privacy Policy</a></span>
              <span className="policy-link"><a href="https://pivotal.io/terms-of-use">Terms of Use</a></span>
              <span className="policy-link" id="teconsent"/>
            </span>
          </footer>
        </FlexCol>
      </Grid>
    );

    return (
      <Grid id="app" gutter={false}>
        <FlexCol fixed>
          <Sidebar updateContent={this.updateContent} activePath={path}/>
        </FlexCol>
        <FlexCol id="content" className="content">
          <div id="wrapper"><PageComponent/></div>
          {footer}
        </FlexCol>
      </Grid>
    );
  }
}
export class Application extends HTMLElement {
  // this value should be replaced by version.js script
  static VERSION = '2024-10-30 15:46:49';

  constructor() {
    super();
  }

  connectedCallback() {
    // fetch('https://api.github.com/repos/pscode-org/pure-snow/releases/latest')
    //   .then(response => response.json())
    //   .then(data => {
    //     const latestVersion = data.tag_name;
    //     if (latestVersion !== Application.VERSION) {
    //       console.log(`New version available: ${ latestVersion }`);
    //     }
    //   });
  }
}

customElements.define('application-container', Application);

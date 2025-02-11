import footerStyles from "./footer.css";
import bootstrapStyles from "./bootstrap.min.css";
class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>${bootstrapStyles} ${footerStyles}</style>
            <footer>
                <div class="container">
                    <div class="row">

                        <div class="footer-col-1 col-md-4 col-sm-12">
                            <h4>IOOS Homepage</h4>
                            <div>
                                <div class="social fb" style="margin-bottom: .5em;">
                                    <a href="https://ioos.noaa.gov/" target="_blank">
                                        <img class="ioos-social" src="https://dgd6r9iiqa8y9.cloudfront.net/images/ioos-social.png"></img>
                                        <span class="txt">ioos.noaa.gov</span>
                                    </a>
                                </div>
                            </div>
                            <br>
                            <h4>Our Social Ocean</h4>
                            <div>
                                <div class="social fb" style="margin-bottom: .5em;">
                                    <a href="https://www.facebook.com/usioosgov" target="_blank">
                                        <svg width="35" height="35" viewBox="0 0 512 512" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"></path>
                                        </svg>
                                        <span class="txt">facebook.com/usioosgov</span>
                                    </a>
                                </div>

                                <div class="social x">
                                    <a href="https://x.com/usioosgov" target="_blank">
                                        <svg width="20" height="20" viewBox="0 0 1200 1227" fill="#fffff" xmlns="http://www.w3.org/2000/svg" style="margin: 0 .5em;">
                                            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/>
                                        </svg>
                                        <span class="txt">x.com/usioosgov</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="footer-col-2 col-md-8 col-sm-12">
                            <img src="https://dgd6r9iiqa8y9.cloudfront.net/images/logo-ioos-white.png"/>
                            <div class="content">
                                <p>U.S. Integrated Ocean Observing System Program</p>
                                <p>1315 East-West Highway<br>SSMC3, 2nd Floor<br>Silver Spring, MD 20910</p>
                                <p><a href="tel:240-533-9444"> (240) 533-9444</a></p>
                                <a class="contact btn" href="mailto:webmaster.ioos.us@noaa.gov">
                                    <span>Contact Us</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
  }

  connectedCallback() {
    setTimeout(() => {
      this.shadowRoot.host.style.visibility = "visible";
    }, 5);
  }
}

customElements.define("ioos-footer", FooterComponent);

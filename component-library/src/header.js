import defaultMenus from '../headerMenuConfig.json';
import bootstrapStyles from './bootstrap.min.css';
import headerStyles from './header.css';

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.menus = defaultMenus;
        this.handleShadowClick = this.handleShadowClick.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleTogglerClick = this.handleTogglerClick.bind(this);
        this.render();
    }

    static get observedAttributes() {
        return ['menu-config', 'variant', 'theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'menu-config') {
            try {
                this.menus = JSON.parse(newValue);
                this.render();
            } catch (error) {
                console.error('Invalid JSON passed to menu-config:', error);
            }
        }
        if (name === 'variant') {
            this.render();
        }
        if (name === 'theme') {
            this.render();
        }
    }

    get menuConfig() {
        return this.menus || defaultMenus;
    }

    set menuConfig(value) {
        this.menus = value;
        this.render(); // Re-render the component when the menu config is updated
    }

    // Resolves the effective variant: 'default', 'no-banner', or 'compact'.
    // ioos-banner="off" is a deprecated alias for variant="no-banner".
    get variant() {
        const variant = this.getAttribute('variant');
        if (variant === 'compact' || variant === 'no-banner') {
            return variant;
        }
        if (this.getAttribute('ioos-banner') === 'off') {
            return 'no-banner';
        }
        return 'default';
    }

    // Resolves the effective theme: 'light' (default) or 'dark'.
    get theme() {
        return this.getAttribute('theme') === 'dark' ? 'dark' : 'light';
    }

    render() {
        const variant = this.variant;
        const isCompact = variant === 'compact';
        const emblemSrc = this.theme === 'dark'
            ? 'https://dgd6r9iiqa8y9.cloudfront.net/images/ioos-emblem-dark.png'
            : 'https://dgd6r9iiqa8y9.cloudfront.net/images/ioos-emblem.png';
        const bannerHtml = variant !== 'no-banner' ? `
                <div class="ioos-top-header">
                    <img src="${emblemSrc}" class="img-fluid" />
                    ${isCompact ? '<span class="compact-caret"></span>' : ''}
                </div>` : '';
        const headerClass = isCompact ? ' class="compact"' : '';
        
        this.shadowRoot.innerHTML = `
            <style>${bootstrapStyles} ${headerStyles}</style>
            <header${headerClass} data-theme="${this.theme}">
                ${bannerHtml}
                <nav class="navbar navbar-expand-lg">
                    <div class="container-fluid">
                        <a class="navbar-brand mobile" href="https://ioos.us">
                            <img src="https://dgd6r9iiqa8y9.cloudfront.net/images/ioos-us-logo.svg" alt="IOOS logo" />
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <a class="navbar-brand desktop" href="https://ioos.us">
                                    <img src="https://dgd6r9iiqa8y9.cloudfront.net/images/ioos-us-logo.svg" alt="IOOS logo" />
                                </a>
                                ${this.renderMenu()}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }

    connectedCallback() {
        this.shadowRoot.addEventListener('click', this.handleShadowClick);
        document.addEventListener('click', this.handleDocumentClick);
        const toggler = this.shadowRoot.querySelector('.navbar-toggler');
        if (toggler) {
            toggler.addEventListener('click', this.handleTogglerClick);
        }

        if (this.variant === 'compact') {
            const banner = this.shadowRoot.querySelector('.ioos-top-header');
            if (banner) {
                this.handleBannerClick = this.handleBannerClick.bind(this);
                banner.addEventListener('click', this.handleBannerClick);
            }
        }

        setTimeout(() => {
            this.shadowRoot.host.style.visibility = 'visible';
        }, 5);
    }

    disconnectedCallback() {
        this.removeListeners(); // Ensure listeners are removed when the element is disconnected
    }

    handleTogglerClick(event) {
        const collapse = this.shadowRoot.querySelector('.navbar-collapse');
        event.stopPropagation();
        collapse.classList.toggle('show');
    }

    handleBannerClick(event) {
        const isMobile = window.matchMedia('(max-width: 990px)').matches;
        if (!isMobile) return;
        event.stopPropagation();
        const collapse = this.shadowRoot.querySelector('.navbar-collapse');
        const caret = this.shadowRoot.querySelector('.compact-caret');
        collapse.classList.toggle('show');
        if (caret) caret.classList.toggle('open');
    }

    handleShadowClick(event) {
        const target = event.target;
        if (target.matches('.dropdown-toggle')) {
            const dropdownMenu = target.nextElementSibling;
            const isOpen = dropdownMenu.classList.contains('show');

            this.closeAllDropdowns();
            if (!isOpen) {
                dropdownMenu.classList.add('show');
                target.closest('.dropdown').classList.add('show');
            }
            event.stopPropagation();
        }
    }

    handleDocumentClick() {
        const collapse = this.shadowRoot.querySelector('.navbar-collapse');
        if (collapse && collapse.classList.contains('show')) {
            collapse.classList.remove('show');
        }
        const caret = this.shadowRoot.querySelector('.compact-caret');
        if (caret) caret.classList.remove('open');
        this.closeAllDropdowns();
    }

    removeListeners() {
        this.shadowRoot.removeEventListener('click', this.handleShadowClick);
        document.removeEventListener('click', this.handleDocumentClick);
        const toggler = this.shadowRoot.querySelector('.navbar-toggler');
        if (toggler) {
            toggler.removeEventListener('click', this.handleTogglerClick);
        }
    }

    closeAllDropdowns() {
        this.shadowRoot.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
            menu.closest('.dropdown').classList.remove('show');
        });
    }

    renderMenu() {
        return this.menuConfig.map(menu => `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="${menu.id}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${menu.title}
                </a>
                <ul class="dropdown-menu" aria-labelledby="${menu.id}">
                    ${menu.items.map(item => `<li><a class="dropdown-item" href="${item.url}" ${item.target ? `target="${item.target}"` : ""}>${item.title}</a></li>`).join("")}
                </ul>
            </li>
        `).join("");
    }
}

customElements.define('ioos-header', HeaderComponent);

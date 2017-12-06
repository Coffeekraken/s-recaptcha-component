import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'
import __closest from 'coffeekraken-sugar/js/dom/closest'


/**
 * @name 		SRecaptchaComponent
 * @extends 	SWebComponent
 * Easily display a google recaptcha form element that will map on a simple checkbox for easy form validation. This does not replace the server side check of the captcha validation.
 *
 * @example 		html
 * <input type="checkbox" name="my-recaptcha" required />
 * <s-recaptcha for="my-recaptcha" sitekey="..." theme="dark"></s-recaptcha>
 * <!-- optional validation -->
 * <s-validator for="my-recaptcha"></s-validator>
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */
export default class SRecaptchaComponent extends SWebComponent {

	/**
	 * Return an array of required props to init the component
	 * @return 		{Array}
	 * @protected
	 */
	static get requiredProps() {
		return ['sitekey'];
	}

	/**
	 * Return a list of promises to resolve before init the component
	 * @return 	{Array} 	An array of promises to resolve
	 * @protected
	 */
	static get mountDependencies() {
		return [function() {
			return this._loadRecaptchaScript();
		}];
	}

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 * @protected
	 */
	static get defaultProps() {
		return {

			/**
			 * Define the checkbox that the captcha will update when clicked. This is the same as the "for" attribute of a label. It will connect the recaptcha to the specified input
			 * This feature let you handle the validation of the captcha depending on a simple checkbox instead of a complexe validation process
			 * @prop
			 * @type 	{String}
			 */
			for : null,

			/**
			 * Define the sitekey to use. [see recaptcha documentation](https://developers.google.com/recaptcha/docs/display)
			 * @prop
			 * @type 	{String}
			 */
			sitekey : null,

			/**
			 * Define the language of the recaptcha to load
			 * @prop
			 * @type 	{String}
			 */
			language : 'en',

			/**
			 * @name 	Google Recaptcha Options
			 * You can pass as props all the available google recaptcha options
			 * @prop
			 * @see 		https://developers.google.com/recaptcha/docs/display
			 */

		};
	}

	/**
	 * Css
	 * @protected
	 */
	static defaultCss(componentName, componentNameDash) {
		return `
			${componentNameDash} {
				display : inline-block;
			}
		`;
	}

	/**
	 * Method that check if a property passed to the component has to be accepted or not.
	 * @param 		{String} 			prop 		The property name
	 * @return 		{Boolean} 						If true, the property will be accepted, if false, it will not be considered as a property
	 * @protected
	 */
	shouldComponentAcceptProp(prop) {
		return true;
	}

	/**
	 * Return a promise that load the google api
	 * @return 	{Promise}
	 * @private
	 */
	_loadRecaptchaScript() {
		return new Promise((resolve, reject) => {

			// if already loaded, resolve directly
			if (window.grecaptcha) {
				resolve(window.grecaptcha);
				return;
			}

			// wait until the window.grecaptcha become available
			document.querySelector('html').addEventListener('s-recaptcha.api-loaded', (e) => {
				resolve(e.detail);
			});

			// if no other s-recaptcha component have already start the script loading,
			// load it by adding the script tag inside the head
			if ( ! document.querySelector('script[s-recaptcha-script]')) {
				const scriptTag = document.createElement('script');
				scriptTag.setAttribute('s-recaptcha-script', true);
				scriptTag.src = `https://www.google.com/recaptcha/api.js?onload=sRecaptchaOnloadCallback&render=explicit`;
				scriptTag.async = true;
				scriptTag.defer = true;

				// add a listener to know when the recaptcha is ready
				window.sRecaptchaOnloadCallback = function() {
					// dispatch a loaded event to let all the components know that
					// the api is available
					__dispatchEvent(document.querySelector('html'), 's-recaptcha.api-loaded', window.grecaptcha);
				}

				// add the tag to the html
				document.querySelector('head').appendChild(scriptTag);
			}

		});
	}

	/**
	 * Component will mount
 	 * @definition 		SWebComponent.componentWillMount
	 * @protected
	 */
	componentWillMount() {
		super.componentWillMount();

		// internal vars
		this._refs = {
			form : null, // the form element in which live the recaptcha element
			input : null // the input element that will reflect the recaptcha status, linked by the "for" attribute
		};
	}

	/**
	 * Mount component
	 * @definition 		SWebComponent.componentMount
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// get the form
		this._refs.form = this._getForm();

		// get the targeted input specified with the "for" attribute
		if (this.props.for) {
			if ( ! this._refs.form) return;
			this._refs.input = this._refs.form.querySelector(`[name="${this.props.for}"],#${this.props.for}`);
		}

		// render the captcha
		this._initCaptcha();
	}

	/**
	 * Init the captcha
	 * @private
	 */
	_initCaptcha() {
		window.grecaptcha.render(this, {
			...this.props,
			callback : () => {
				if ( ! this._refs.input) return;
				this._refs.input.checked = true;
				// trigger a change
				__dispatchEvent(this._refs.input, 'change');
			}
		});
	}

	/**
	 * Get form that handle the captcha field
	 * @return 		{String} 			The form element that handle the captcha field
	 * @private
	 */
	_getForm() {
		if ( this._refs.form) return this._refs.form;
		this._refs.form = __closest(this, 'form');
		return this._refs.form;
	}
}

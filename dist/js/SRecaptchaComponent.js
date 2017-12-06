Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _closest = require('coffeekraken-sugar/js/dom/closest');

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var SRecaptchaComponent = function (_SWebComponent) {
	_inherits(SRecaptchaComponent, _SWebComponent);

	function SRecaptchaComponent() {
		_classCallCheck(this, SRecaptchaComponent);

		return _possibleConstructorReturn(this, (SRecaptchaComponent.__proto__ || Object.getPrototypeOf(SRecaptchaComponent)).apply(this, arguments));
	}

	_createClass(SRecaptchaComponent, [{
		key: 'shouldComponentAcceptProp',


		/**
   * Method that check if a property passed to the component has to be accepted or not.
   * @param 		{String} 			prop 		The property name
   * @return 		{Boolean} 						If true, the property will be accepted, if false, it will not be considered as a property
   * @protected
   */
		value: function shouldComponentAcceptProp(prop) {
			return true;
		}

		/**
   * Return a promise that load the google api
   * @return 	{Promise}
   * @private
   */

	}, {
		key: '_loadRecaptchaScript',
		value: function _loadRecaptchaScript() {
			return new Promise(function (resolve, reject) {

				// if already loaded, resolve directly
				if (window.grecaptcha) {
					resolve(window.grecaptcha);
					return;
				}

				// wait until the window.grecaptcha become available
				document.querySelector('html').addEventListener('s-recaptcha.api-loaded', function (e) {
					resolve(e.detail);
				});

				// if no other s-recaptcha component have already start the script loading,
				// load it by adding the script tag inside the head
				if (!document.querySelector('script[s-recaptcha-script]')) {
					var scriptTag = document.createElement('script');
					scriptTag.setAttribute('s-recaptcha-script', true);
					scriptTag.src = 'https://www.google.com/recaptcha/api.js?onload=sRecaptchaOnloadCallback&render=explicit';
					scriptTag.async = true;
					scriptTag.defer = true;

					// add a listener to know when the recaptcha is ready
					window.sRecaptchaOnloadCallback = function () {
						// dispatch a loaded event to let all the components know that
						// the api is available
						(0, _dispatchEvent2.default)(document.querySelector('html'), 's-recaptcha.api-loaded', window.grecaptcha);
					};

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

	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			_get(SRecaptchaComponent.prototype.__proto__ || Object.getPrototypeOf(SRecaptchaComponent.prototype), 'componentWillMount', this).call(this);

			// internal vars
			this._refs = {
				form: null, // the form element in which live the recaptcha element
				input: null // the input element that will reflect the recaptcha status, linked by the "for" attribute
			};
		}

		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   * @protected
   */

	}, {
		key: 'componentMount',
		value: function componentMount() {
			_get(SRecaptchaComponent.prototype.__proto__ || Object.getPrototypeOf(SRecaptchaComponent.prototype), 'componentMount', this).call(this);

			// get the form
			this._refs.form = this._getForm();

			// get the targeted input specified with the "for" attribute
			if (this.props.for) {
				if (!this._refs.form) return;
				this._refs.input = this._refs.form.querySelector('[name="' + this.props.for + '"],#' + this.props.for);
			}

			// render the captcha
			this._initCaptcha();
		}

		/**
   * Init the captcha
   * @private
   */

	}, {
		key: '_initCaptcha',
		value: function _initCaptcha() {
			var _this2 = this;

			window.grecaptcha.render(this, _extends({}, this.props, {
				callback: function callback() {
					if (!_this2._refs.input) return;
					_this2._refs.input.checked = true;
					// trigger a change
					(0, _dispatchEvent2.default)(_this2._refs.input, 'change');
				}
			}));
		}

		/**
   * Get form that handle the captcha field
   * @return 		{String} 			The form element that handle the captcha field
   * @private
   */

	}, {
		key: '_getForm',
		value: function _getForm() {
			if (this._refs.form) return this._refs.form;
			this._refs.form = (0, _closest2.default)(this, 'form');
			return this._refs.form;
		}
	}], [{
		key: 'defaultCss',


		/**
   * Css
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay : inline-block;\n\t\t\t}\n\t\t';
		}
	}, {
		key: 'requiredProps',


		/**
   * Return an array of required props to init the component
   * @return 		{Array}
   * @protected
   */
		get: function get() {
			return ['sitekey'];
		}

		/**
   * Return a list of promises to resolve before init the component
   * @return 	{Array} 	An array of promises to resolve
   * @protected
   */

	}, {
		key: 'mountDependencies',
		get: function get() {
			return [function () {
				return this._loadRecaptchaScript();
			}];
		}

		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */

	}, {
		key: 'defaultProps',
		get: function get() {
			return {

				/**
     * Define the checkbox that the captcha will update when clicked. This is the same as the "for" attribute of a label. It will connect the recaptcha to the specified input
     * This feature let you handle the validation of the captcha depending on a simple checkbox instead of a complexe validation process
     * @prop
     * @type 	{String}
     */
				for: null,

				/**
     * Define the sitekey to use. [see recaptcha documentation](https://developers.google.com/recaptcha/docs/display)
     * @prop
     * @type 	{String}
     */
				sitekey: null,

				/**
     * Define the language of the recaptcha to load
     * @prop
     * @type 	{String}
     */
				language: 'en'

				/**
     * @name 	Google Recaptcha Options
     * You can pass as props all the available google recaptcha options
     * @prop
     * @see 		https://developers.google.com/recaptcha/docs/display
     */

			};
		}
	}]);

	return SRecaptchaComponent;
}(_SWebComponent3.default);

exports.default = SRecaptchaComponent;
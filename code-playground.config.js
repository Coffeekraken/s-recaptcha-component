module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-recaptcha-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
				<div class="container">
					<h1 class="h1 m-b-small">
						Coffeekraken s-recaptcha-component
					</h1>
					<p class="p m-b-bigger">
						Easily display a google recaptcha form element that will map on a simple checkbox for easy form validation. This does not replace the server side check of the captcha validation.
					</p>
					<form name="my-cool-form">
						<input type="checkbox" name="my-captcha" style="display:none" required />
						<s-recaptcha for="my-captcha" sitekey="6Lc_tSMUAAAAAK1h8735Eln0YUTZxHHmtBbkWhzQ"></s-recaptcha>
						<s-validator for="my-captcha"></s-validator>

						<input type="checkbox" name="my-captcha-2" style="display:none" required />
						<s-recaptcha class="m-t" theme="dark" for="my-captcha-2" sitekey="6Lc_tSMUAAAAAK1h8735Eln0YUTZxHHmtBbkWhzQ"></s-recaptcha>
						<s-validator for="my-captcha-2"></s-validator>

						<input type="submit" value="Submit" class="btn btn--primary m-t" />
					</form>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@include s-init();
				@include s-classes();
				@include s-typography-classes();
				@include s-button-classes();
				body {
					background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
				}
				.container {
					@include s-position(absolute, middle, center);
					min-width:80vw;
				}
				input[type="checkbox"][invalid] + s-recaptcha {
					border:1px solid s-color(error);
				}
				s-validator {
					display:block;
					color: s-color(error);
					font-size:12px;
					padding:5px 0;
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import 'webcomponents.js/webcomponents-lite'
				import SValidatorComponent from 'coffeekraken-s-validator-component'
				import SRecaptchaComponent from './dist/index'
			`
		}
	}
}

# SRecaptchaComponent

Extends **SWebComponent**

Easily display a google recaptcha form element that will map on a simple checkbox for easy form validation. This does not replace the server side check of the captcha validation.


### Example
```html
	<input type="checkbox" name="my-recaptcha" required />
<s-recaptcha for="my-recaptcha" sitekey="..." theme="dark"></s-recaptcha>
<!-- optional validation -->
<s-validator for="my-recaptcha"></s-validator>
```
Author : Olivier Bossel <olivier.bossel@gmail.com>




## Attributes

Here's the list of available attribute to set on the element.

### for

Define the checkbox that the captcha will update when clicked. This is the same as the "for" attribute of a label. It will connect the recaptcha to the specified input
This feature let you handle the validation of the captcha depending on a simple checkbox instead of a complexe validation process

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### sitekey

Define the sitekey to use. [see recaptcha documentation](https://developers.google.com/recaptcha/docs/display)

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### language

Define the language of the recaptcha to load

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **en**


### Google Recaptcha Options

You can pass as props all the available google recaptcha options

See more : [https://developers.google.com/recaptcha/docs/display](https://developers.google.com/recaptcha/docs/display)
"use strict"
// MIT License

// Copyright (c) 2022 Emmadi Sumith Kumar

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const JsSHA = require("jssha")

function get_totp(key, options) {
	options = options || {}
	let epoch, time, shaObj, hmac, offset, otp
	options.period = options.period || 30
	options.algorithm = options.algorithm || "SHA-1"
	options.digits = options.digits || 6
	options.timestamp = options.timestamp || Date.now()
	key = base32tohex(key)
	epoch = Math.round(options.timestamp / 1000.0)
	time = leftpad(dec2hex(Math.floor(epoch / options.period)), 16, "0")
	shaObj = new JsSHA(options.algorithm, "HEX")
	shaObj.setHMACKey(key, "HEX")
	shaObj.update(time)
	hmac = shaObj.getHMAC("HEX")
	offset = hex2dec(hmac.substring(hmac.length - 1))
	otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + ""
	otp = otp.substr(Math.max(otp.length - options.digits, 0), options.digits)
	return otp
}

function hex2dec(s) {
	return parseInt(s, 16)
}

function dec2hex(s) {
	return (s < 15.5 ? "0" : "") + Math.round(s).toString(16)
}

function base32tohex(base32) {
	let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
		bits = "",
		hex = ""

	base32 = base32.replace(/=+$/, "")

	for (let i = 0; i < base32.length; i++) {
		let val = base32chars.indexOf(base32.charAt(i).toUpperCase())
		if (val === -1) throw new Error("Invalid base32 character in key")
		bits += leftpad(val.toString(2), 5, "0")
	}

	for (let i = 0; i + 8 <= bits.length; i += 8) {
		let chunk = bits.substring(i, 8 + i)
		hex = hex + leftpad(parseInt(chunk, 2).toString(16), 2, "0")
	}
	return hex
}

function leftpad(str, len, pad) {
	if (len + 1 >= str.length) {
		str = Array(len + 1 - str.length).join(pad) + str
	}
	return str
}

module.exports.get_totp = get_totp

#!/usr/bin/env node

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

import inquirer from "inquirer"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import path from "path"
import fs from "fs"
import { Table } from "console-table-printer"
import { get_totp } from "../lib/generator.cjs"
import cliCursor from "cli-cursor"

var colors = ["cyan", "green", "yellow", "blue", "magenta", "white", "red"]
const xargv = yargs(hideBin(process.argv))
	.usage("Usage: \n$0 add (Add a 2FA key)\n$0 remove (Remove a 2FA key).")
	.option("interactive", {
		alias: "i",
		description: "Interactively select 2FA account",
		type: "boolean",
	})

	.help()
	.alias("help", "h").argv

// console.log(xargv)
function read_file(file) {
	try {
		const data = fs.readFileSync(file, "utf8")
		return JSON.parse(data)
	} catch (err) {
		var data = {
			status: false,
			data: [],
		}
		return data
	}
}

function interactive(endTime, data, colors) {
	if (new Date().getTime() + 1000 < endTime.getTime()) {
		var remainingTime = (endTime.getTime() - (new Date().getTime() + 1000)) / 1000
		var remainingTimeSecounds = Math.round(remainingTime)
		var sec = new Date().getSeconds()

		const p = new Table({
			columns: [{ name: "SlNo" }, { name: "account", alignment: "left" }, { name: "username", alignment: "left" }, { name: "otp" }, { name: "time" }],
		})

		for (let [index1, data1] of data.entries()) {
			try {
				var otp = get_totp(data1.key)
			} catch (error) {
				console.error(`\x1b[31mError: ${error.message}\x1b[0m`)
				if (error.message == "Invalid base32 character in key") {
					console.error(
						`Run '\x1b[33mtotpjs remove\x1b[0m' and remove '\x1b[34m${data1.account}\x1b[0m' account with username '\x1b[32m${data1.username}\x1b[0m' :`,
					)
					process.exit()
				}
				process.exit()
			}
			var topt_time = 30
			p.addRow(
				{
					SlNo: index1,
					account: data1.account,
					username: data1.username,
					otp,
					time: (sec >= topt_time ? 59 - sec : topt_time - 1 - sec) + " s",
				},
				{ color: colors[index1 % 7] },
			)
		}
		const clearLines = (n) => {
			for (let i = 0; i < n; i++) {
				const y = i === 0 ? null : -1
				process.stdout.moveCursor(0, y)
				process.stdout.clearLine(1)
			}
			process.stdout.cursorTo(0)
		}
		cliCursor.hide()
		process.stdout.write(p.render())
		clearLines(4 + data.length)
		setTimeout(function () {
			interactive(endTime, data, colors)
		}, 1000)
	}
}

var dir = path.join(process.env.HOME || process.env.HOMEPATH, "/.config/totpjs")

if (!fs.existsSync(dir)) {
	try {
		fs.mkdirSync(dir, { recursive: true })
	} catch (error) {
		console.log(error.message)
		process.exit()
	}
}

const key_file = path.join(process.env.HOME || process.env.HOMEPATH, "/.config/totpjs", "accounts.json")

var file_data = read_file(key_file)
if (!file_data.status) {
	var data = {
		status: true,
		data: [],
	}
	fs.writeFileSync(key_file, JSON.stringify(data, null, 4)),
		(err) => {
			if (err) {
				console.log("\x1b[31m%s\x1b[0m", err.message)
				process.exit()
			}
		}
	file_data = data
}

process.on("SIGINT", function () {
	console.log("\nAborting")
	// clearTimeout(0)
	process.exit()
})

if (xargv._[0] == "add") {
	inquirer
		.prompt([
			{
				name: "name",
				message: "Enter Account Name ?",
			},
			{
				name: "username",
				message: "Enter username of account ?",
			},
			{
				name: "key",
				message: "Enter a key to add 2FA ?",
			},
		])
		.then((answers) => {
			var name_exist = false
			let temp_x = 0
			for (let [index, account] of file_data.data.entries()) {
				if (account.name == answers.name) {
					name_exist = true
					temp_x = index
					break
				}
			}
			if (answers.name == "" || answers.username == "" || answers.key == "") {
				console.error("\x1b[33m'name','username' and 'key' fields should not be empty.\x1b[0m")
				console.error("\x1b[33mKey not added\x1b[0m")
			} else if (file_data.data.length != 0 && name_exist) {
				for (let [index2, account2] of file_data.data[temp_x].accounts.entries()) {
					if (account2.username == answers.username) {
						console.error(`\x1b[33mUsername '${answers.username}' already exist for '${answers.name}'.\nUse different username\x1b[0m`)
						process.exit()
					}
				}
				var acc_arr = {
					username: answers.username,
					key: answers.key,
				}
				file_data.data[temp_x].accounts.push(acc_arr)
				fs.writeFileSync(key_file, JSON.stringify(file_data, null, 4)),
					(err) => {
						if (err) {
							console.log("\x1b[31m%s\x1b[0m", err.message)
							process.exit()
						}
					}
				console.log("\x1b[32m%s\x1b[0m", `${answers.name} 2FA Key added successfully.`)
			} else {
				var ans_arr = {
					name: answers.name,
					accounts: [
						{
							username: answers.username,
							key: answers.key,
						},
					],
				}
				file_data.data.push(ans_arr)
				fs.writeFileSync(key_file, JSON.stringify(file_data, null, 4)),
					(err) => {
						if (err) {
							console.log("\x1b[31m%s\x1b[0m", err.message)
							process.exit()
						}
					}
				console.log("\x1b[32m%s\x1b[0m", `${answers.name} 2FA Key added successfully.`)
			}

			// console.log(JSON.stringify(file_data, null, 3))
		})
		.catch((error) => {
			if (error.isTtyError) {
				console.error("Prompt couldn't be rendered in the current environment")
			} else {
				console.error(error.message)
			}
		})
} else if (xargv._[0] == "remove") {
	var names_arr = []
	if (file_data.data.length == 0) {
		console.log(`\x1b[33mNo account was added.\nrun 'totpjs --help' or 'totpjs add'\x1b[0m`)
	} else {
		file_data.data.forEach((element) => {
			names_arr.push(element.name)
		})
		inquirer
			.prompt([
				{
					type: "list",
					name: "name",
					message: "Select the account ?",
					choices: names_arr,
				},
			])
			.then((answers) => {
				var user_name_arr = []
				const name_index = names_arr.findIndex((element) => element == answers.name)
				// console.log(file_data.data[name_index].accounts)
				file_data.data[name_index].accounts.forEach((element1) => {
					user_name_arr.push(element1.username)
				})
				inquirer
					.prompt([
						{
							type: "list",
							name: "username",
							message: `Select the username for ${answers.name} ?`,
							choices: user_name_arr,
						},
						{
							type: "list",
							name: "status",
							message: "Are you sure ?",
							choices: ["yes", "no"],
							filter(val) {
								return val.toLowerCase()
							},
							name_index,
						},
					])
					.then((answers2) => {
						if (answers2.status == "yes") {
							var check_num = Math.floor(Math.random() * (999 - 100 + 1) + 100)
							const user_name_index = user_name_arr.findIndex((element) => element == answers2.username)
							// console.log(`${user_name_index},${name_index}`)
							// console.log(answers)
							// console.log(answers2)
							inquirer
								.prompt([
									{
										type: "number",
										name: "check_number",
										message: `Enter '\x1b[32m${check_num}\x1b[0m' to delete '\x1b[33m${answers2.username}\x1b[0m@\x1b[34m${answers.name}\x1b[0m' :`,
										choices: user_name_arr,
									},
								])
								.then((answers3) => {
									if (answers3.check_number == check_num) {
										file_data.data[name_index].accounts.splice(user_name_index, 1)
										if (file_data.data[name_index].accounts.length == 0) {
											file_data.data.splice(name_index, 1)
										}
										fs.writeFileSync(key_file, JSON.stringify(file_data, null, 4)),
											(err) => {
												if (err) {
													console.log("\x1b[31m%s\x1b[0m", err.message)
													process.exit()
												}
											}

										console.log(`'\x1b[33m${answers2.username}\x1b[0m@\x1b[34m${answers.name}\x1b[0m'\x1b[32m is deleted.\x1b[0m`)
										// console.log(JSON.stringify(file_data,null,3))
									} else {
										console.error(`\x1b[31mEnter correct number\x1b[0m`)
									}
								})
						} else {
							console.error(`\x1b[31mCancelled\x1b[0m`)
						}
					})
			})
	}
} else if (xargv.i) {
	var names_arr = []
	if (file_data.data.length == 0) {
		console.log(`\x1b[33mNo account was added.\nrun 'totpjs --help' or 'totpjs add'\x1b[0m`)
	} else {
		file_data.data.forEach((element) => {
			names_arr.push(element.name)
		})
		inquirer
			.prompt([
				{
					type: "list",
					name: "name",
					message: "Select the account ?",
					choices: names_arr,
				},
			])
			.then((answers) => {
				var user_name_arr = []
				const name_index = names_arr.findIndex((element) => element == answers.name)
				// console.log(file_data.data[name_index].accounts)
				file_data.data[name_index].accounts.forEach((element1) => {
					user_name_arr.push(element1.username)
				})
				inquirer
					.prompt([
						{
							type: "list",
							name: "username",
							message: `Select the username for ${answers.name} ?`,
							choices: user_name_arr,
						},
					])
					.then((answers2) => {
						const user_name_index = user_name_arr.findIndex((element) => element == answers2.username)
						var startTime = new Date()
						var endTime = new Date(startTime.getTime() + 5 * 60 * 1000)
						interactive(
							endTime,
							[
								{
									account: answers.name,
									username: answers2.username,
									key: file_data.data[name_index].accounts[user_name_index].key,
								},
							],
							colors,
						)
					})
			})
	}
} else {
	const p = new Table({
		columns: [{ name: "SlNo" }, { name: "account", alignment: "left" }, { name: "username", alignment: "left" }, { name: "otp" }],
	})
	if (file_data.data.length == 0) {
		console.log(`\x1b[33mNo account was added.\nrun 'totpjs --help' or 'totpjs add'\x1b[0m`)
	} else {
		var array = []
		for (let [index1, data] of file_data.data.entries()) {
			for (let [index2, data2] of data.accounts.entries()) {
				array.push({
					account: file_data.data[index1].name,
					username: data2.username,
					key: data2.key,
				})
			}
		}

		var startTime = new Date()
		var endTime = new Date(startTime.getTime() + 5 * 60 * 1000)
		interactive(endTime, array, colors)
	}
}

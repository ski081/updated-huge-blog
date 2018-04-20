+++

author = "Mark Struzinski"
title = "Expanding on Generic Json Parsing"
tags = ["json", "swift", "codable"]
date = 2018-04-12T18:21:18-04:00
slug = "expanding-on-generic-json-parsing"
draft = true

+++

Expanded JSON Parsing with Generics

In the [last post](http://markstruzinski.com/post/generic-json-parsing), we went over a very simple way to use generics when parsing a small object that had a value type that would be determined at runtime. Today, I'd like to expand on that concept a bit and show how I implemented that concept into a parent struct that contained arrays of this object.

<!--more-->

As a quick recap, we had this object:

{{< highlight swift >}}

struct PropertyEntry<T: Codable>: Codable {
    let appVersion: String
    let value: T
}

{{< /highlight >}}

The `value` property in this struct is a generic, and is specified at runtime. 

Here is an example of using this from my unit tests:

{{< highlight swift >}}

let jsonString = "{\"appVersion\": \"1.0.1\", \"defaultValue\": true}"
let data = jsonString.data(using: .utf8)!
let decoder = JSONDecoder()

let response: BCPAppVersionValue<Bool> = 
	try! decoder.decode(BCPAppVersionValue<Bool>.self, from: data)

{{< /highlight >}}

Keep in mind I'm doing a lot of force unwrapping here because I'm in a test case, this is not a safe practice in production code! Moving on from this, I needed an object that would represent the setting for a property, including all potentials values for each version number. 

The object declaration looks like this:

{{< highlight swift >}}

public struct PropertySetting<T: Codable>: Codable {
    public let defaultValue: T
    public let valuesByVersion: [PropertyEntry<T>]?
}

{{< /highlight >}} 

The `defaultValue` in this object is decoded exactly the same way as the object in the [last post](/2018/03/generic-json-parsing/). The interesting part comes in when decoding `valuesByVersion`. This item it typed as an array of `PropertyEntry<T>`. For this one, we're going to have to drop into a custom init to get the object decoded properly. 

Here's the relevant code block, then I'll walk through and explain everything:

{{< highlight swift >}}

public init(from decoder: Decoder) throws {
	let container = try decoder.container(keyedBy: CodingKeys.self)
    
	var defaultValue = try container.decode(T.self, forKey: .defaultValue)
	let valuesByVersion = try? container.decode(Array<BCPAppVersionValue<T>>.self, forKey: .valuesByVersion)
    
	if let versions = valuesByVersion,
    	let appVersion = decoder.userInfo[BCPPropertyOptions.key] as? String {
    	if let updatedDefault = versions.filter({ version -> Bool in
        	version.appVersion == appVersion
    	}).first {
        	defaultValue = updatedDefault.defaultValue
    	}
	}
    
	self.defaultValue = defaultValue
	self.valuesByVersion = valuesByVersion
}

{{< /highlight >}}

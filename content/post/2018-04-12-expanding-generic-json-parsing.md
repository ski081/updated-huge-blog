+++

author = "Mark Struzinski"
title = "Expanding on Generic Json Parsing"
tags = ["json", "swift", "codable"]
date = 2018-04-12T18:21:18-04:00
slug = "expanding-on-generic-json-parsing"

+++

Expanded JSON Parsing with Generics

In the [last post](http://markstruzinski.com/post/generic-json-parsing), I went over a very simple way to use generics when parsing a small object that had a value type determined at runtime. Today, I'd like to expand on that concept a bit and show how I implemented that concept into a parent struct that contained arrays of this object.

<!--more-->

As a quick recap, here is the original object:

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

Keep in mind I'm doing a lot of force unwrapping here because I'm in a test case. This is not a safe practice in production code! Moving on from this, I needed an object that would represent the setting for a property, including all potentials values for each version number of the app. The buisiness requirement here is to use the default value unless it is overridden. A default value is overridden if the optional array of `valuesByVersion` contains a setting that matches the current app version. 

The object declaration looks like this:

{{< highlight swift >}}

public struct PropertySetting<T: Codable>: Codable {
    public let defaultValue: T
    public let valuesByVersion: [PropertyEntry<T>]?
}

{{< /highlight >}}

The `defaultValue` in this object is decoded exactly the same way as the object in the [last post](/2018/03/generic-json-parsing/). The interesting part comes in when decoding `valuesByVersion`. 

Here is the business logic I need to run on the array of `PropertySetting` objects:

1. Parse the initial result (default value)
2. Check the optional array of values by version
3. Compare the app version(s) contained in this array to the current app version
4. If the current app version matches one of the values in the array, then that means there is a custom setting for this app version. Ensure that version overrides the default and use it.

This item is typed as an array of `PropertyEntry<T>`. For this one, I'll have to drop into a custom init to get the object decoded properly. 

Here's the relevant code block, then I'll walk through and explain everything:

{{< highlight swift >}}

public init(from decoder: Decoder) throws {
	let container = try decoder.container(keyedBy: CodingKeys.self)
    
    // 1
	var defaultValue = try container.decode(T.self, forKey: .defaultValue)
	
	// 2
	let valuesByVersion = try? container.decode(Array<PropertySetting<T>>.self, forKey: .valuesByVersion)
    
    // 3
	if let versions = valuesByVersion,
    	let appVersion = decoder.userInfo["appVersion"] as? String {
    	if let updatedDefault = versions.filter({ version -> Bool in
        	version.appVersion == appVersion
    	}).first {
        	defaultValue = updatedDefault.defaultValue
    	}
	}
   
   // 4
	self.defaultValue = defaultValue
	self.valuesByVersion = valuesByVersion
}

{{< /highlight >}}


With the new `Decodable` protocol, anytime you want to run custom logic when decoding an object (rather than just mapping properties to values), you need to implement `init(from decoder: Decoder)`. After this point you, are reponsible for initializing all non-optional properties of your model object prior to exiting the method. I'll use the `init` method here to check for the specific version of the running app instance, and see if that version is in the list of `PropertyEntry` objects coming back in the list. If it is, then I know there is a custom setting for this version of the app and I'll use it. This is accomplished by passing in some context to the JSON Decoder. 

1. Decode an initial defaultValue from the single entry in the base JSON response
2. Try to decode an array of `PropertyEntry` objects from the response
3. If an array exists, check the `userInfo` dictionary attached to the decoder. If an appVersion exists in here, use it as a filter value.
4. Assign the result of all that logic to the defaultValue of the model object

##### Note

Like a lot of other objects in Cocoa Touch APIs, you are allowed to attach a `userInfo` dictionary to the decoder. For this decoding scenario, I'm attaching the current app version to the decoder that parses this object. When creating this dictionary, the keys are of type `CodingUserInfoKey`. 

Here is the declaration of `CodingUserInfoKey` in Swift:

{{< highlight swift >}}

/// A user-defined key for providing context during encoding and decoding.
public struct CodingUserInfoKey : RawRepresentable, Equatable, Hashable 

{{< /highlight >}}

Here is how to attach that dictionary to a decoder:

{{< highlight swift >}}

let decoder = JSONDecoder()
guard let infoKey = CodingUserInfoKey(rawValue: "appVersion") else {
    preconditionFailure("Invalid info key")
}

let infoDict: [CodingUserInfoKey: Any] = [
    infoKey: "1.4.0"
]

decoder.userInfo = infoDict

{{< /highlight >}}

This was a lot, but I hope it shows how flexible and powerful we can make parsing logic now with `Decodable`. It also reduces a ton of boilerplate code, which is a solid improvement. 


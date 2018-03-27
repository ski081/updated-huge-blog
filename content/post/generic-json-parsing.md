+++

author = "Mark Struzinski"
title = "Generic Json Parsing"
date = 2018-02-08T14:31:43-05:00
draft = true

+++

I have been working a lot in model layers lately. One benefit of this has been converting our older JSON parsing code over to using Swift 4's enhanced JSON parsing capabilities. Using the `Codable` protocol has allowed me to delete hundreds of lines of boilerplate and streamline a lot of repetitive and error-prone code.

A lot of this work is pretty straightforward, where we are mapping properties to types, and sometimes including a `CodingKey` protocol object to ensure property names are mapped to JSON keys correctly. However, I ran across one interesting scenario and I wanted to share my solution to it. 

I'll present a simple generic object and its associated json in this post, and then show how that expanded out to a pretty nice solution once that smaller object became part of the full service in a future post.

<!--more-->

I have a service response that includes a list of values keyed by an app version that have the same bacis structure, but can return different types. We use this file to enable and disable app features, and to control values, such as strings for contact numbers and messaging. Each value entry has the same structure, but it could come typed as a `String` or `Int` or any other type. 

Here is a small example:

{{< highlight json >}}

{
    "customer_care_number": {
        "app_version": "1.0.0",
        "value": "888-999-1111" 
    },
    "product_search_limit": {
        "app_version": "1.0.0",
        "value": 6
    } 
}

{{< /highlight >}}

All entries have this same format. Aside from the key that identifies each object, each entry has an `app_version` key and a `value` key. Rather that going through a tedious and long custom decoding process for these, I decided to try to compose them using generics. 

Here is what I came up with:

{{< highlight swift >}}

struct PropertyEntry<T: Codable>: Codable {
    let appVersion: String
    let value: T
}

{{< /highlight >}}

The main object that holds all of these entries is called `BusinessProperties". Here is what the setup looks like for that file:

{{< highlight swift >}}

struct BusinessProperties {
    let customerCareNumber: PropertyEntry<String>
    let productSearchLimit: PropertyEntry<Int>

    case CodingKeys: String, CodingKey {
        case customerCareNumber = "customer_care_number"
        case productSearchLimit = "product_search_limit"
    }
}

{{< /highlight >}}

This was one of those times that the simple solution didn't seem like it _should_ work. But once I wrote some unit tests to check it, it ran exactly as expected. I was very impressed with the simplicity and expressiveness of this solution. Swift is such a nice language to work in.

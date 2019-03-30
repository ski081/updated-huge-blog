+++

author = "Mark Struzinski"
title = "Handling Incoming Links"
tags = ["universal-links"]
date = 2018-12-09T21:21:10-05:00
slug = "handling-incoming-links"
draft = true

+++

In order to properly handle incomning universal links, your site association file has to declare the link patterns your app will handle. Your site association file will contain an `applinks` object. That object will in turn contain a `details` section which will contain an array of path patterns to match. Your app will also have to ship with Associated Domains capability enabled, and a list of supported URLs. Each URL will be prefixed with `applinks:`.

{{< figure src="/images/applinks.png" caption="" >}}

If a user has your app installed and taps a link in Safari, Messages, Notes, or other apps which present URLs, and that URL path pattern matches your site association file, iOS will atempt to hand that link presentation off to your app instead of Mobile Safari. 

Here is an example site association file with applinks:

{{< highlight json >}}
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABC123.com.example.app",
        "paths": [
          "NOT */write-a-review/*",
          "/pd/*",
          "/pl/*",
          "/store/*",
          "/ml",
          "/"
        ]
      }
    ]
  }
}
{{< /highlight >}}
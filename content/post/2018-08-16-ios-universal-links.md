+++

author = "Mark Struzinski"
title = "iOS Universal Links Tips"
tags = ["universal-links"]
date = 2018-08-16T23:04:13-04:00
slug = "ios-universal-links"

+++

We have been expanding our use of universal links lately. While links are complicated and difficult to set up, once they are configured properly, making incremental updates to them is pretty trivial, and they are a great feature. We have implemented a few deep links so far. We also use the site association file to validate site ownership for password autofill. We will soon be using the site association file for implementing the Shared Web Credentials feature as well.

Here are a few lessons learned along the way:

* Always plan on testing against a domain hosted over SSL with an official signed certificate (self-signed will not work)
* Typing a URL directly into Mobile Safari will not trigger the universal link. You'll need to get it into an external source and select it from there.

<!--more-->

From my experience, the following sources will work:

    * Notes app
    * Link from a web page
    * Link sent via an email
    * Link tapped from the Messages app

There is a quick way to check if a link is registering correctly on the device. Long press on the link that you expect to deep link. An action sheet will appear. If you see an entry that read "Open in (your app name)...", then your limk is configured correctly.

In my next post, I'll review some setup steps and how to handle incoming universal links in your apps.
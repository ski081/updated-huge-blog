+++

author = "Mark Struzinski"
title = "Generic Json Parsing"
date = 2018-02-08T14:31:43-05:00
draft = true

+++

I have been working a lot in model layers lately. One benefit of this has been converting our older JSON parsing code over to using Swift 4's enhanced JSON parsing capabilities. Using the `Codable` protocol has allowed me to delete hundreds of lines of boilerplate and streamline a lot of repetitive and error-prone code.

A lot of this work is pretty straightforward, where we are mapping properties to types, and sometimes including a `CodingKey` protocol object to ensure property names are mapped to JSON keys correctly. However, I ran across one interesting scenario and I wanted to share my solution to it. 

+++

title = "A Change in Direction"
date = "2013-05-14"
tags = ["unit-testing-series"]
author = "Mark Struzinski"
showSocial = false

+++

In hitting brick walls, taking road trips for work, and feeling guilty about
about posting in weeks, I have reconsidered the return on investment when fully
implementing logic tests. 

<!--more-->

I have dealt with compiler flag issues, missing
imports, manually adding .m files for compilation, and a host of other issues.
After having my own doubts, and reading [this post][1] (the entire thing had me
nodding my head), I've decided to reconsider my take on application vs unit
tests. Going forward, I'm going to rework this series from the start using
application tests.

They seem to be much quicker to run now. They are definitely a win in the
setup/configuration department. Logic tests are much more difficult to implement.

Stay tuned for more.

[1]: http://iosunittesting.com/ocunit-logic-tests-are-dead/?utm_source=rss&utm_medium=rss&utm_campaign=ocunit-logic-tests-are-dead "this post"

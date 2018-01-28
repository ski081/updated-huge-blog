+++

title = "Setting Up iOS Logic Tests [Part 2]"
date = "2013-02-13"
tags = ["unit-testing-series"]
author = "Mark Struzinski"
series = ["Unit Testing Beginner Series"]

+++

This is part 2 in a [multi-part series][series] on iOS unit testing and
integration testing. In the [last post][last-post], we discussed setting up
the project and adding some dependencies with CocoaPods.

Today, I’m going to go through setting up some initial code to use the 3rd
party libraries to make sure that the libraries are working. Then we’ll set up
logic tests and see what breaks with CocoaPods (spoiler: compiler
	errors ahead!).

<!--more-->

## SVProgressHUD

First, let’s hook up [SVProgressHUD][github]

1. Open `ViewController.m` and import SVProgressHUD: `#import "SVProgressHUD.h”`
2. In `viewDidLoad`, create an SVProgressHUD indicator, then dismiss it after 2 seconds:

{{< highlight obj-c >}}

-(void)viewDidLoad{
  [super viewDidLoad];
  [SVProgressHUD showWithStatus:@"Running..."];
  double delayInSeconds = 2.0;
  dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW,
		(int64_t)	(delayInSeconds * NSEC_PER_SEC));
  dispatch_after(popTime, dispatch_get_main_queue(), ^(void) {
    [SVProgressHUD dismiss];
  });
}

{{< /highlight >}}

You should be able to run this code now and see a progress indicator with a
spinner and the text “Running....”. It should disappear after 2 seconds.

{{< figure src="/images/logictests-svprogresshud-spinner.png" caption="" >}}

Great! This proves one of our CocoaPods libraries is communicating with the
app’s main project and is working properly.

Next we’ll move onto Core Data with Magical Record.

[github]: https://github.com/samvermette/SVProgressHUD
[series]: /blog/2013/02/01/unit-testing-series/
[last-post]: /blog/2013/02/08/setting-up-ios-logic-tests/

+++

author = "Mark Struzinski"
title = "Using NSXMLParser"
date = "2010-06-07T09:21:37-07:00"
tags = ["cocoa", "nsxmlparser", "coding"]
showSocial = false

+++


This is my first stab at an iPhone project. I'm writing an app that consumes an RSS feed and parses it to retrieve a few bits of information for display on the screen. This is my first attempt at an implementation. Coming from a .NET background, it is quite a paradigm shift when switching to the heavily convention based world of Cocoa 	development.

If I was writing this app in .NET, I'd go out looking for the proper class libraries to parse the XML and begin framing out a class to perform all the functions I needed to populate an object to be 	persisted to the UI.

<!--more-->

When researching the best way to do this, I found 2 prevalent methods of parsing XML in Cocoa:

* [NSXMLParser][nsxmlparser]
* [Touch XML][touchxml]

I decided to go with NSXMLParser because it seemed like the path of least friction to get started with. NSXMLParser is a stream based reader. It basically reads the entire XML tree character by character and fires off events via delegate calls when it encounters useful information. I found this model very easy to use. After some trial and error, I've got it working well for my current project.

I am parsing the xml feed for [Woot.com][woot]. The following is an abbreviated snippet of the elements I am interested in. The actual feed has a lot more info in it, but this should give you a feel for the structure:


{{< highlight xml >}}
<channel>
  <copyright />
  <description>Woot! - One Day, One Deal</description>
<docs>http://www.rssboard.org/rss-specification</docs>
<generator>
Oppositional.Syndication, 1.0.0.0, http://www.oppositionallydefiant.com/
</generator>
<item>
<description>[Removed for brevity]</description>
<link>http://www.woot.com/</link>
<title>Dyson DC24 Blueprint Limited Edition</title>
<woot:price xmlns:woot="http://www.woot.com/">$279.99</woot:price>
<woot:soldout xmlns:woot="http://www.woot.com/">False</woot:soldout>
<woot:wootoff xmlns:woot="http://www.woot.com/">False</woot:wootoff>
<woot:purchaseurl xmlns:woot="http://www.woot.com/">
http://www.woot.com/WantOne.aspx?id=e94aa72d-5860-4f9b-bab2-42211de2f4cc
</woot:purchaseurl>
<woot:thumbnailimage xmlns:woot="http://www.woot.com/">
http://sale.images.woot.com/Dyson_DC24_Blueprint_Limited_EditionbklThumbnail.jpg
</woot:thumbnailimage>
<woot:substandardimage xmlns:woot="http://www.woot.com/">
http://sale.images.woot.com/Dyson_DC24_Blueprint_Limited_EditionxxcShoppingYahoo.jpg
</woot:substandardimage>
<woot:standardimage xmlns:woot="http://www.woot.com/">
http://sale.images.woot.com/Dyson_DC24_Blueprint_Limited_Editionm32Standard.jpg
</woot:standardimage>
<woot:detailimage xmlns:woot="http://www.woot.com/">
http://sale.images.woot.com/Dyson_DC24_Blueprint_Limited_Edition98lDetail.jpg
</woot:detailimage>
<woot:shipping xmlns:woot="http://www.woot.com/">$5 shipping</woot:shipping>
</item>
</channel>
{{< /highlight >}}

### Defining the Model Object

The first thing I did was create a model object which would encapsulate the element values from the rss feed that I was interested in. Here is the code for the class:

#### SaleItem.h
{{< highlight obj-c >}}

#import <Foundation/Foundation.h>

@interface SaleItem : NSObject {
  NSString *itemTitle;
  NSString *itemPrice;
  NSString *itemThumbnaillUrl;
  NSString *itemSubstandardImageUrl;
  NSString *itemStandardImageUrl;
  NSString *itemDetailImageUrl;
  NSString *itemDescription;
  NSString *itemShippingCost;
  NSString *itemSaleUrl;

  BOOL isWootOff;
}

@property (nonatomic, retain) NSString *itemTitle;
@property (nonatomic, retain) NSString *itemPrice;
@property (nonatomic, retain) NSString *itemThumbnaillUrl;
@property (nonatomic, retain) NSString *itemSubstandardImageUrl;
@property (nonatomic, retain) NSString *itemStandardImageUrl;
@property (nonatomic, retain) NSString *itemDetailImageUrl;
@property (nonatomic, retain) NSString *itemDescription;
@property (nonatomic, retain) NSString *itemShippingCost;
@property (nonatomic, retain) NSString *itemSaleUrl;
@property (nonatomic, assign) BOOL isWootOff;

@end

{{< /highlight >}}

#### SaleItem.m

{{< highlight obj-c >}}

#import "SaleItem.h"

@implementation SaleItem

@synthesize itemTitle;
@synthesize itemPrice;
@synthesize itemThumbnaillUrl;
@synthesize itemSubstandardImageUrl;
@synthesize itemStandardImageUrl;
@synthesize itemDetailImageUrl;
@synthesize itemDescription;
@synthesize itemShippingCost;
@synthesize itemSaleUrl;
@synthesize isWootOff;

- (void)dealloc {
  [itemTitle release];
  [itemPrice release];
  [itemThumbnaillUrl release];
  [itemSubstandardImageUrl release];
  [itemStandardImageUrl release];
  [itemDetailImageUrl release];
  [itemDescription release];
  [itemShippingCost release];
  [itemSaleUrl release];

  [super dealloc];
}

@end

{{< /highlight >}}

### Defining a Class to Reference Constants

Next, to make my life easier, I defined a class to define some constants. These constants define the string values I will be searching for as I parse the XML.

#### Constants.h
{{< highlight obj-c >}}

#import <Foundation/Foundation.h>

extern NSString * const ITEM;
extern NSString * const TITLE;
extern NSString * const PRICE;
extern NSString * const THUMBNAIL_IMAGE;
extern NSString * const SUBSTANDARD_IMAGE;
extern NSString * const STANDARD_IMAGE;
extern NSString * const DETAIL_IMAGE;
extern NSString * const DESCRIPTION;
extern NSString * const IS_WOOTOFF;
extern NSString * const SHIPPING_PRICE;
extern NSString * const SALE_URL;

@interface Constants : NSObject { }

{{< /highlight >}}

#### Constants.m

{{< highlight obj-c >}}

#import "Constants.h"
@implementation Constants
  NSString * const ITEM = @"item";
  NSString * const TITLE = @"title";
  NSString * const PRICE = @"woot:price";
  NSString * const THUMBNAIL_IMAGE = @"woot:thumbnailimage";
  NSString * const SUBSTANDARD_IMAGE = @"woot:substandardimage";
  NSString * const STANDARD_IMAGE = @"woot:standardimage";
  NSString * const DETAIL_IMAGE = @"woot:detailimage";
  NSString * const DESCRIPTION = @"description";
  NSString * const IS_WOOTOFF = @"woot:wootoff";
  NSString * const SHIPPING_PRICE = @"woot:shipping";
  NSString * const SALE_URL = @"woot:purchaseurl";
@end

{{< /highlight >}}

### Creating the Worker Class

NSXMLParser works using delegate callbacks to let you hook into events that
you are interested in. Most of the examples I found online used delegate methods
right inside the viewcontroller to accomplish the parsing. Since I have several
views which are going to take advantage of this functionality, I decided to
split it out into a worker class. Let's construct this class
(I named it XMLParser) piece by piece:

#### XMLParser.h

{{< highlight obj-c >}}

#import <UIKit/UIKit.h>

@class Constants; //Forward declaration of the Constants class
@class SaleItem;  //Forward declaration of the SaleItem model object class

@interface XMLParser : NSObject {
  // This will hold element values as we build them piece by piece
  NSMutableString *currentValue;
  // This will determine if we are currently parsing an element
  BOOL itemElementInProgress;
  // Instance of our model object
  SaleItem *saleItem;
}

@property (nonatomic, retain) NSMutableString *currentValue;
@property (nonatomic, retain) SaleItem *saleItem;
@property BOOL itemElementInProgress;

- (BOOL) parse; // This performs the parsing of the file
- (id)initWithSaleItem:(SaleItem *)aSaleItem; // Custom initializer
- (void) trimString; // Small convenience method to remove whitespace

@end

{{< /highlight >}}

#### Building XMLParser.m

Lets start with our basic shell:

{{< highlight obj-c >}}

#import "Constants.h"
#import "SaleItem.h"
#import "XMLParser.h"

@implementation XMLParser
  // Synthesize our properties
  @synthesize currentValue;
  @synthesize itemElementInProgress;
  @synthesize saleItem;

  // Make sure objects are released
  -(void)dealloc{
	  [currentValue release];
	  [saleItem release];
	  [super dealloc];
  }
@end

{{< /highlight >}}

Now, let's create the initializer. Add the following code directly after the property
@synthesize calls:

{{< highlight obj-c >}}

// Sets the saleItem property to a SaleItem object passed in
- (id)initWithSaleItem:(SaleItem *)aSaleItem {
  if (self = [super init]) {
    [self setSaleItem:aSaleItem];
    [self setItemElementInProgress:NO];
  }

  return self;
}

{{< /highlight >}}

I am initializing the class this way so I can populate the SaleItem inside of
XMLParser and still have access to it from the calling class (a ViewController)
when I'm done parsing.

Before we get into how to instantiate NSXMLParser and use it to parse a file,
let's set up the delegate methods to get the data we need out of the file.

I usually put delegate methods at the bottom of the file, right after a
[#pragma mark][cocoasamurai] definition to delineate this group of methods from
the rest of the code. Hop down to the bottom of XMLParser.m, and place this
code just prior to @end:

#### Delegate Method
{{< highlight obj-c >}}

#pragma MARK - NSXMLParser Delegate Calls
// This method gets called every time NSXMLParser encounters a new element
-(void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName
namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qualifiedName
attributes:(NSDictionary *)attributeDict {
  // If element is named "item", set bool to true so we know
  // we are inside the element in other methods. This is needed
  // because "item" contains most of the data we need
  if ([elementName isEqualToString:ITEM]) {
    [self setItemElementInProgress:YES];
  }
}

// This method gets called for every character NSXMLParser finds.
-(void)parser:(NSXMLParser *)parser foundCharacters:(NSString *)string {
  // If currentValue doesn't exist, initialize and allocate
  if (!currentValue) {
    currentValue = [[NSMutableString alloc] init];
  }

  // Append the current character value to the running string
  // that is being parsed
  [currentValue appendString:string];
}

{{< /highlight >}}

The final delegate method is fired when NSXMLParser reaches the end of an element. Here is the place we can be sure we have gotten the full value of the element, and can now persist that data to our model object for use. right after the foundCharacters method, add this method:

#### Delegate Method

{{< highlight obj-c >}}

// This method is called whenever NSXMLParser reaches the end of an element
-(void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName
namespaceURI:(NSString *)namespaceURI
qualifiedName:(NSString *)qName {
  [self trimString];  // Remove whitespace with a convenience method

  if ([elementName isEqualToString:ITEM]) {
    // If we are currently on the "item" element,
    // then do not save value
    [self setItemElementInProgress:NO];
  }

  // If we are processing an element inside of "item",
  // then determine if we need to save the value
  if (self.itemElementInProgress) {
    // Now check the element id against the ones we are
    // interested in (using the Constants class values).
    // If we find one, set the corresponding property on the
    // SaleItem object
  if ([elementName isEqualToString:TITLE]) {
    [[self saleItem] setItemTitle:currentValue];
  }

  if ([elementName isEqualToString:PRICE]) {
    [[self saleItem] setItemPrice:currentValue];
  }

  if ([elementName isEqualToString:THUMBNAIL_IMAGE]) {
    [[self saleItem] setItemThumbnaillUrl:currentValue];
  }

  if ([elementName isEqualToString:SUBSTANDARD_IMAGE]) {
    [[self saleItem] setItemSubstandardImageUrl:currentValue];
  }

  if ([elementName isEqualToString:STANDARD_IMAGE]) {
    [[self saleItem] setItemStandardImageUrl:currentValue];
  }

  if ([elementName isEqualToString:DETAIL_IMAGE]) {
    [[self saleItem] setItemDetailImageUrl:currentValue];
  }

  if ([elementName isEqualToString:DESCRIPTION]) {
    [[self saleItem] setItemDescription:currentValue];
  }

  if ([elementName isEqualToString:SHIPPING_PRICE]) {
    [[self saleItem] setItemShippingCost:currentValue];
  }

  if ([elementName isEqualToString:SALE_URL]) {
    [[self saleItem] setItemSaleUrl:currentValue];
  }
}

  [currentValue release];
  currentValue = nil;
}

{{< /highlight >}}

### The Parse Method

Finally, the whole process is started by the parse method:

{{< highlight obj-c >}}

- (BOOL)parse {
  // Create and initialize an NSURL with the RSS feed address and use it to
	// instantiate NSXMLParser
  NSURL *url =
	  [[NSURL alloc] initWithString:@"http://www.woot.com/salerss.aspx"];
  NSXMLParser *parser = [[NSXMLParser alloc] initWithContentsOfURL:url];

  // Tell NSXMLParser that this class is its delegate
  [parser setDelegate:self];

  // Kick off file parsing
  [parser parse];

  // Clean up
  [url release];

  [parser setDelegate:nil];
  [parser release];
  return YES;
}

{{< /highlight >}}

### Final Notes
Some final thoughts on the methodology I am using:

- I want to get rid of the if statements and use Key-Value coding to set property values. I haven't gotten the chance to refactor this
- I am very new to Cocoa, and any suggestions/comments are welcome and encouraged!

[nsxmlparser]:https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/NSXMLParser_Class/Reference/Reference.html
[touchxml]:https://github.com/TouchCode/TouchXML
[woot]:www.woot.com/salerss.aspx
[cocoasamurai]:http://cocoasamurai.blogspot.com/2006/09/tip-pragma-mark-organizing-your-source.html

# gamemonkey
TamperMonkey scripts for use with board game websites

## How to Use These Scripts

### Install TamperMonkey Browser Extension

Install the TamperMonkey browser extension:

- [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
(no mobile extension)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd) 
  (Android available)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) (Android available)
- [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)
- [Safari](https://apps.apple.com/app/tampermonkey/id6738342400) ($2.99 but works on iOS)
- [Safari (TM Alternative)](https://itunes.apple.com/us/app/userscripts/id1463298887) 
  (Free Userscripts for Mac/iOS, scripts are not tested with this)

[Tutorial Video](https://www.youtube.com/watch?v=8tyjJD65zws)

### Install Individual Scripts

### BoardGameGeek

##### [Auto-Caption Uploads from Filename](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/autoCaptionUploads.user.js)

When uploading files to BGG, extract the filename up to the first '.' and set the caption to 
that string automatically

##### [Default Wishlist Sort to Ascending](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/sortWishlistLinks.user.js)

For links to wishlists from a user's profile page, default the sort to ascending by wishlist 
priority.

##### [eBay Alternate Names US-Only Search Link](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/ebayAltNamesSearchLink.user.js)

When viewing the eBay marketplace page for an item, change the '+ ADD' button into a search 
button that opens a US-only search which includes searching for alternate names for the game.

Includes BGG's eBay parameters so that they continue to get commissions from sales.

##### [Filter / Sort 'Do Not Buy' in Collections](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/filterDoNotBuy.user.js)

When viewing a collection in a list view, with the status column visible, move wishlist 'Do Not 
Buy' rows to the bottom of the page, and fade them so they are less visible than other rows.

##### [Game Link Preview on Hover](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/gameLinkPreview.user.js)

When viewing pages with links to game/expansion/etc. items, hovering over a link shows a preview 
of the item.

##### [Geeklist Thumbnail Collage (Square)](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geeklistThumbCollage.user.js)

Create a grid collage layout out of the geeklist item images in a list.  After making the grid, 
you can take a screenshot for use elsewhere.

1. Navigate to your geeklist, where there will be a 'GATHER' button and a text box where you set 
the number of elements you want in each grid.

2. Change the default '16' if you want a larger or smaller grid and then click 'GATHER'.

3. If the list is multiple pages, go to the next page.  Then click 'GATHER' again and repeat as 
desired.

4. Resize your browser window to arrange the grid into the width and height you want.

5. Screenshot!

##### [Geeklist Thumbnail Collage (Masonry)](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geeklistThumbCollageMasonry.user.js)

Create a 'masonry' style collage layout out of the geeklist item images in a list.  After making 
the grid, you can take a screenshot for use elsewhere.

1. Navigate to your geeklist, where there will be a 'GATHER' button and a text box where you set
   the width of your collage elements.

2. Change the width if you want larger or smaller items and then click 'GATHER'.

3. If the list is multiple pages, go to the next page.  Then click 'GATHER' again and repeat as
   desired.

4. Screenshot!

##### [Large Gallery Collection Links](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/largeGalleryCollectionLinks.user.js)

Changes links in user profiles to show a 'large gallery' cover view instead of text list by default.

##### [Remember Dashboard State](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/rememberDashboardState.user.js)

Remember and restore dashboard dropdowns state between visits to the dashboard.

##### [Rules File Sorter](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/rulesFilesSorter.user.js)

When viewing file pages, attempts to sort official rules / rules to the top (for the current 
page of files).

##### [Small Gallery Collection Links](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/smallGalleryCollectionLinks.user.js)

Changes links in user profiles to show a 'small gallery' cover view instead of text list by default.

##### [SPLU Userscript](https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/splu.user.js)

Adds the [SPLU](https://boardgamegeek.com/guild/3403) play logger via a userscript, and makes the "Log Play" BGG button trigger the SPLU 
to launch.

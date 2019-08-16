## Hook vs Callback

The terminology here is a bit fuzzy. In general the two attempt to achieve similar results.
In general, a callback is a function (or delegate) that you register with the API to be called at the appropriate time in the flow of processing (e.g to notify you that the processing is at a certain stage)
A hook traditionally means something a bit more general that serves the purpose of modifying calls to the API (e.g. modify the passed parameters, monitor the called functions). In this meaning it is usually much lower level than what can be achieved by higher-level languages like Java.
In the context of iOS, the word hook means the exact same thing as callback above

Rocket

coordinate system:
- positive y is going down

Viewport
- This is referring to the browser window including the scrollbar.

Size
- An object with width and height properties.

pivot
- point of rotation.

Offset
- An object containing just 2 properties, top, left.

FullOffset
- An object containing 4 properties: top, bottom, left, right.

Rect
- Union of FullOffset and Size with the addition of center, a Point object.

## Improtant Note

# Box Model
Content > Padding > Border > Margin

border-box

box-sizing: border-box | content-box
border-box: width and height properties includes content, padding, and broder.

## window.innerWidth, window.innerHeight

Supported only by window object

readonly: Returns width or height (in pixels) of the browser window viewport including,
if rendered, the vertical and horizontal scrollbar.

## window.outerWidth, window.outerHeight

readonly: Returns gets the width or height of the outside of the browser window.

It represents the width or height of the whole browser window including sidebar (if expanded),
window chrome and window resizing borders/handles.

## element.clientWidth, element.clientHeight

this returns zero for inline elements and elements with no CSS;
otherwise, it's the inner width or height of an element in pixels.
It includes padding but excludes borders, margins, and vertical scrollbars 

HTMLElement.offsetWidth
HTMLElement.offsetHeight
read-only property returns the layout width of an element as an integer.
Typically, offsetWidth or offsetHeight is a measurement in pixels of the element's CSS width or height,
including any borders, padding, and vertical scrollbars (if rendered).
It does not include the width of pseudo-elements such as ::before or ::after.

Element.getBoundingClientRect()
Returns a DOMRect object: top, bottom, left, right, width, height
properties relative (other than width and height) to the Viewport and top-left of the border-box.
The width and height returned are based on scale so that includes after transform (scale).

Element.scrollWidth
Element.scrollHeight
read-only property is a measurement of the width or height of an element's content,
including content not visible on the screen due to overflow.

The scrollWidth value is equal to the minimum width the element would require
in order to fit all the content in the viewport without using a horizontal scrollbar.
The width is measured in the same way as clientWidth:
it includes the element's padding, but not its border, margin or vertical scrollbar (if present).
It can also include the width of pseudo-elements such as ::before or ::after.
If the element's content can fit without a need for horizontal scrollbar, its scrollWidth is equal to clientWidth

// scroll

window

element
scrollLeft
scrollTop
property gets or sets the number of pixels that an element's content is scrolled from its left edge.
Is not read-only you can set it.
scrollTo()


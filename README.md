![Untitled design (1)](https://github.com/user-attachments/assets/d2013982-7878-4513-af11-d043e45fa437)



# SectionRenderingSdk Documentation

The `SectionRenderingSdk` class provides utility methods for working with [Shopify Section Rendering API](https://shopify.dev/docs/api/section-rendering) in a JavaScript-based front-end. It allows you to fetch and dynamically render individual or multiple Shopify sections.

[Watch this YouTube video by Jan on how Section Rendering API works](https://www.youtube.com/watch?v=s1khSuOyAUA)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [`getSection(sectionId)`](#getsectionsectionid)
  - [`getSections(sectionIds)`](#getsectionssectionids)
  - [`renderElement(sectionId, elements)`](#renderelementsectionid-elements)
- [Examples](#examples)

---

## Installation

Download the SDK file here:

👉 [Download section-rendering-sdk.js](section-rendering-sdk.js)

Then include the downloaded file in your Shopify theme. Add the following line inside your `theme.liquid` layout file, **before** including your main `global.js` or other scripts:

```liquid
<script src="{{ 'section-rendering-sdk.js' | asset_url }}" defer="defer"></script>
```

---

## Usage

Create an instance of the SDK:

```js
const sectionRenderingSdk = new SectionRenderingSdk();
```

---

## API Reference

### `getSection(sectionId)`

Fetches a single Shopify section's HTML using the `section_id` query parameter and parses it as a `Document`.

#### Parameters

- `sectionId` (`string`): The ID of the section you want to fetch.

#### Returns

- `Promise<Document>`: The section HTML parsed into a DOM Document object.

#### Example

```js
sectionRenderingSdk.getSection("main-cart-footer").then((doc) => {
    const footer = doc.querySelector(".footer-js-content");
    document.querySelector(".footer-js-content").replaceWith(footer);
});
```

---

### `getSections(sectionIds)`

Fetches multiple sections using the `sections` query parameter and returns a plain object containing HTML strings.

#### Parameters

- `sectionIds` (`string`): Comma-separated list of section IDs (e.g., `"cart,main-product"`).

#### Returns

- `Promise<Object>`: A key-value map where each key is a section ID and the value is the corresponding HTML string.

#### Example

```js
sectionRenderingSdk.getSections("cart,main-product").then((response) => {
    console.log(response['cart']); // raw HTML string of the cart section
});
```

---

### `renderElement(sectionId, elements)`

Fetches a section, then finds and replaces the specified DOM elements with their updated versions from the newly fetched section.

#### Parameters

- `sectionId` (`string`): ID of the section to fetch and render.
- `elements` (`string[]`): Array of CSS selectors for the elements to be replaced.

#### Returns

- `Promise<void>`: Resolves when all elements have been rendered and replaced.

#### Example

```js
let sectionId = "cart";
sectionRenderingSdk.renderElement(sectionId, [
    ".cart-totals",
    ".cart-items"
]).then(() => {
    // do whatever want to done after elements render
});
```

---

## Examples

### Refresh Section Elements After Cart Update

```js
const sectionRenderingSdk = new SectionRenderingSdk();

sectionRenderingSdk.renderElement("cart-section", [
    ".cart-totals",
    ".cart-items"
]).then(() => {
    // do whatever want to done after elements render
});
```

### Load Multiple Sections in Parallel

```js
sectionRenderingSdk.getSections("main-product,product-recommendations").then((sections) => {
    document.querySelector("#main-product").innerHTML = sections["main-product"];
    document.querySelector("#recommendations").innerHTML = sections["product-recommendations"];
});
```

---

## Notes

- This class depends on standard browser APIs like `fetch`, `Promise`, and `DOMParser`.
- Shopify's Section Rendering API must be enabled and properly set up in your theme.
- For performance reasons, always limit the number of elements and section fetches per action.

---

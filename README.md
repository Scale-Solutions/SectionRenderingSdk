# SectionRenderingSdk Documentation

The `SectionRenderingSdk` class provides utility methods for working with [Shopify Section Rendering API](https://shopify.dev/docs/api/section-rendering) in a JavaScript-based front-end. It allows you to fetch and dynamically render individual or multiple Shopify sections.

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

This is a standalone SDK. Just include the class in your JavaScript bundle or as a module in your project:

```js
class SectionRenderingSdk {
    getSection(sectionId){
        return new Promise((resolve, reject) => {
            fetch(`/?section_id=${sectionId}`)
                .then((response) => {
                    if (!response.ok) {
                        reject(`HTTP error! Status: ${response.status}`);
                    }
                    response.text().then((text) => {
                        resolve(new DOMParser().parseFromString(text, 'text/html'));
                    });
                });
        });
    }

    getSections(sectionIds){
        return new Promise((resolve, reject) => {
            fetch(`/?sections=${sectionIds}`)
                .then((response) => {
                    if (!response.ok) {
                        reject(`HTTP error! Status: ${response.status}`);
                    }
                    response.text().then((text) => {
                        resolve(JSON.parse(text));
                    });
        });
    }

    async renderElement(sectionId, elements = []) {
        try {
            const section = await this.getSection(sectionId);
            if (section) {
                elements.forEach(element => {
                    const rendered_element = section.querySelector(element);
                    const current_element = document.querySelector(element);
                    if (rendered_element && current_element) {
                        current_element.replaceWith(rendered_element);
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
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

- `sectionIds` (`string`): Comma-separated list of section IDs (e.g., `"benefits-blocks,main-product"`).

#### Returns

- `Promise<Object>`: A key-value map where each key is a section ID and the value is the corresponding HTML string.

#### Example

```js
sectionRenderingSdk.getSections("benefits-blocks,main-product").then((response) => {
    console.log(response['benefits-blocks']); // raw HTML string of the benefits-blocks section
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
const loading = document.querySelector(".loading-indicator");

sectionRenderingSdk.renderElement(loading.dataset.section, [
    ".ts-cart__free",
    ".drawer__footer",
    ".footer-js-content"
]).then(() => {
    if (loading) loading.classList.remove("loading");
    listenCartChange(); // Re-initialize any cart listeners
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
    updateUI();
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

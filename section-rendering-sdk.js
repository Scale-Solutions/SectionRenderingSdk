/**
 * SectionRenderingSdk - A lightweight utility for working with Shopify's Section Rendering API.
 * Provides methods to fetch and dynamically render one or multiple Shopify sections on the page.
 *
 * Created by Scale Solutions Developer, 2025
 */

class SectionRenderingSdk {

    /**
     * Fetch a single section by its ID and return it as a parsed HTML document.
     * @param {string} sectionId - The section ID to fetch from the server.
     * @returns {Promise<Document>} - Parsed DOM document of the section.
     */
    getSection(sectionId, url="/"){
        return new Promise((resolve, reject) => {
            fetch(`${url}?section_id=${sectionId}`)
                .then((response) => {
                    if (!response.ok) {
                        reject(`HTTP error! Status: ${response.status}`);
                    }
                    // Parse the response HTML into a DOM Document
                    response.text().then((text) => {
                        resolve(new DOMParser().parseFromString(text, 'text/html'));
                    });
                });
        });
    }

    /**
     * Fetch multiple sections by their IDs and return their raw HTML as a JSON object.
     * @param {string} sectionIds - Comma-separated section IDs (e.g., "cart,product").
     * @returns {Promise<Object>} - An object containing sectionId => sectionHTML pairs.
     */
    getSections(sectionIds){
        return new Promise((resolve, reject) => {
            fetch(`/?sections=${sectionIds}`)
                .then((response) => {
                    if (!response.ok) {
                        reject(`HTTP error! Status: ${response.status}`);
                    }
                    // Parse the response JSON string into an object
                    response.text().then((text) => {
                        resolve(JSON.parse(text));
                    });
                });
        });
    }

    /**
     * Dynamically replace DOM elements with updated versions from a rendered section.
     * @param {string} sectionId - The section ID to render.
     * @param {Array<string>} elements - Array of CSS selectors for the elements to update.
     * @returns {Promise<void>}
     */
    async renderElement(sectionId, elements = [], url="/") {
        try {
            const section = await this.getSection(sectionId, url);
            if (section) {
                elements.forEach(element => {
                    const rendered_element = section.querySelector(element);
                    const current_element = document.querySelector(element);
                    // Replace the current DOM element with the updated version
                    if (rendered_element && current_element) {
                        current_element.replaceWith(rendered_element);
                    }
                });
            }
        } catch (e) {
            console.log(e); // Graceful error logging
        }
    }
}

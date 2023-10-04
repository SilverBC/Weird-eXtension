chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "toggleMonochrome":
            toggleMonochrome();
            break;
        case "toggleBlindness":
            toggleBlindness();
            break;
        case "toggleProtanopia":
            toggleProtanopia();
            break;
        case "toggleDeuteranopia":
            toggleDeuteranopia();
            break;
        case "toggleTritanopia":
            toggleTritanopia();
            break;
        default:
            console.log("Unknown action:", message.action);
    }
});

function injectColorBlindnessFilters() {
        const svgNamespace = "http://www.w3.org/2000/svg";
        const filterIdPrefix = "colorBlindnessFilter-";
    
        const filters = {
            "protanopia": {
                type: "feColorMatrix",
                values: "0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"
            },
            "deuteranopia": {
                type: "feColorMatrix",
                values: "0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"
            },
            "tritanopia": {
                type: "feColorMatrix",
                values: "0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"
            },
            "blindness": {
                type: "feGaussianBlur",
                stdDeviation: "5"
            }
        };
    
        const svg = document.createElementNS(svgNamespace, "svg");
        svg.style.display = "none";
        document.body.appendChild(svg);
    
        for (const [filterName, filterData] of Object.entries(filters)) {
            const filter = document.createElementNS(svgNamespace, "filter");
            filter.id = filterIdPrefix + filterName;
    
            if (filterData.type === "feColorMatrix") {
                const feColorMatrix = document.createElementNS(svgNamespace, filterData.type);
                feColorMatrix.setAttribute("type", "matrix");
                feColorMatrix.setAttribute("values", filterData.values);
                filter.appendChild(feColorMatrix);
            } else if (filterData.type === "feGaussianBlur") {
                const feGaussianBlur = document.createElementNS(svgNamespace, filterData.type);
                feGaussianBlur.setAttribute("in", "SourceGraphic");
                feGaussianBlur.setAttribute("stdDeviation", filterData.stdDeviation);
                filter.appendChild(feGaussianBlur);
            }
    
            svg.appendChild(filter);
        }
}    

let isMonochrome = false;
function toggleMonochrome() {
    if (isMonochrome) {
        document.documentElement.style.filter = '';
    } else {
        document.documentElement.style.filter = 'grayscale(100%)';
    }
    isMonochrome = !isMonochrome;
}

let activeFilter = null;
function toggleBlindness() {
    console.log("Toggling Blindness...");
    if (activeFilter === "blindness") {
        document.documentElement.style.filter = "";
        activeFilter = null;
    } else {
        document.documentElement.style.filter = 'url("#colorBlindnessFilter-blindness")';
        activeFilter = "blindness";
    }
}
function toggleProtanopia() {
    console.log("Toggling Protanopia...");
    if (activeFilter === "protanopia") {
        document.documentElement.style.filter = "";
        activeFilter = null;
    } else {
        document.documentElement.style.filter = 'url("#colorBlindnessFilter-protanopia")';
        activeFilter = "protanopia";
    }
}
function toggleDeuteranopia() {
    if (activeFilter === "deuteranopia") {
        document.documentElement.style.filter = "";
        activeFilter = null;
    } else {
        document.documentElement.style.filter = 'url("#colorBlindnessFilter-deuteranopia")';
        activeFilter = "deuteranopia";
    }
}
function toggleTritanopia() {
    if (activeFilter === "tritanopia") {
        document.documentElement.style.filter = "";
        activeFilter = null;
    } else {
        document.documentElement.style.filter = 'url("#colorBlindnessFilter-tritanopia")';
        activeFilter = "tritanopia";
    }
}
injectColorBlindnessFilters();
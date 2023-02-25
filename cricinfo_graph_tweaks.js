console.log("hello there this is working!");

class BattingDataRow {
    constructor(name, matches, runs, average, balls_faced, strikerate, hundreds) {
        this.name = name;
        this.matches = parseInt(matches);
        this.runs = parseInt(runs);
        this.average = parseFloat(average);
        this.balls_faced = parseInt(balls_faced);
        this.strikerate = parseFloat(strikerate);
        this.hundreds = parseFloat(hundreds);
    }
}

class BowlingDataRow {
    constructor(name, matches, runs, wickets, average, economy, strike_rate) {
        this.name = name;
        this.matches = parseInt(matches);
        this.runs = parseInt(runs);
        this.wickets = parseInt(wickets);
        this.average = parseFloat(average);
        this.economy = parseFloat(economy);
        this.strikerate = parseFloat(strike_rate);
    }
}

class FieldingDataRow {
    constructor(name, matches, dismissals, catches, stumpings) {
        this.name = name;
        this.matches = parseInt(matches);
        this.dismissals = parseInt(dismissals);
        this.catches = parseInt(catches);
        this.stumpings = parseFloat(stumpings);
    }
}

const BATTING_GRAPH_STATS = ["runs", "matches", "average", "strikerate", "hundreds"]
const BOWLING_GRAPH_STATS = ["wickets", "average", "economy", "strikerate"]
const FIELDING_GRAPH_STATS = ["dismissals", "catches", "stumpings"]
class Discipline {
    constructor() {
        this.current = "";
    }

    getCurrentDiscipline(document) {
        let disciplines = ["Batting", "Bowling", "Fielding"]
        for (const span of document.querySelectorAll("span")) {
            if (disciplines.includes(span.textContent) &&
                    span.className == "ds-text-tight-m ds-font-regular ds-text-typo") {
                console.log("Current format:", span.textContent);
                this.current = span.textContent
                return;
            }
        }

        this.current = "";
    }

    getStatsToGraph() {
        if (this.current == "Batting") {
            return BATTING_GRAPH_STATS;
        } else if (this.current == "Bowling") {
            return BOWLING_GRAPH_STATS;
        } else if (this.current == "Fielding") {
            return FIELDING_GRAPH_STATS;
        }

        return ["Format Not Supported!"]
    }
}

// Main graphing functions

function createDatasetFromData(category, labels, data) {
    return {
        labels: labels,
        datasets: [{
            label: category,
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };
}

function createGraphElement(canvas, dataset) {
    console.log("creating graph");
    console.log(dataset);
    const chart = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: dataset,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    });
    return chart;
}

function updateGraphElement(chart, labels, data) {
    chart.data.labels = labels
    chart.data.datasets[0].data = data
    console.log("updated with", labels, data);
    chart.update();
}

const ROW_NAME = "ROW_NAME";
function getColumnByName(searchName, colNames, row) {
    if (searchName == ROW_NAME) {
        return row[0].innerText;
    }

    const idx = colNames.indexOf(searchName);
    console.log(searchName, idx);
    if (idx == -1) {
        return "0"; // Not an ideal error value.
    }

    return row[idx].innerText;
}

function getBattingData(heading) {
    const tableHeader = heading.parentNode.querySelector("thead");
    let colNames = Array.from(tableHeader.rows[0].cells).map(x => x.innerText);
    console.log(colNames);
    const table = heading.parentNode.querySelector("tbody");
    console.log(table);
    let teams = [];
    for (const row of table.rows) {
        const cols = row.cells;
        console.log(cols[0].innerText, cols[5].innerText, cols[6].innerText, cols[7].innerText);
        // This is standard across batting tables.
        // TODO: Create a new constructor that takes a list of stats
        // This would allow the stats parsing to be more extensible.
        const battingDataRow = new BattingDataRow(
            getColumnByName(ROW_NAME, colNames, cols), // Team Name
            getColumnByName("Mat", colNames, cols), // Num Matches
            getColumnByName("Runs", colNames, cols), // Runs
            getColumnByName("Avg", colNames, cols), // Avg
            getColumnByName("BF", colNames, cols), // BF
            getColumnByName("SR", colNames, cols), // Strikerate
            getColumnByName("100s", colNames, cols) // Hundreds
        );
        teams.push(battingDataRow);
    }

    return teams;
}

function getBowlingData(heading) {
    const tableHeader = heading.parentNode.querySelector("thead");
    let colNames = Array.from(tableHeader.rows[0].cells).map(x => x.innerText);
    console.log(colNames);
    const table = heading.parentNode.querySelector("tbody");
    console.log(table);
    let teams = [];
    for (const row of table.rows) {
        const cols = row.cells;
        // This is standard across bowling tables.
        const bowlingDataRow = new BowlingDataRow(
            getColumnByName(ROW_NAME, colNames, cols),  // Team Name
            getColumnByName("Mat", colNames, cols),  // Num Matches
            getColumnByName("Runs", colNames, cols),  // Runs
            getColumnByName("Wkts", colNames, cols),  // Wickets
            getColumnByName("Avg", colNames, cols),  // Average
            getColumnByName("Econ", colNames, cols), // Economy
            getColumnByName("SR", colNames, cols)  // Strike Rate
        );
        teams.push(bowlingDataRow);
    }

    return teams;
}

function getFieldingData(heading) {
    const tableHeader = heading.parentNode.querySelector("thead");
    let colNames = Array.from(tableHeader.rows[0].cells).map(x => x.innerText);
    console.log(colNames);
    const table = heading.parentNode.querySelector("tbody");
    console.log(table);
    let teams = [];
    for (const row of table.rows) {
        const cols = row.cells;
        // This is standard across fielding tables.
        const fieldingDataRow = new FieldingDataRow(
            getColumnByName(ROW_NAME, colNames, cols),  // Team Name
            getColumnByName("Mat", colNames, cols),  // Num Matches
            getColumnByName("Dis", colNames, cols),  // Dismissals
            getColumnByName("Ct", colNames, cols),  // Catches
            getColumnByName("St", colNames, cols),  // Stumpings
        );
        teams.push(fieldingDataRow);
    }

    return teams;
}

function increaseHeadingSize(heading) {
    const newHeading = document.createElement("h2");
    newHeading.className = "ds-font-bold";
    newHeading.style = "font-size: var(--font-size-text-base); line-height: 1.3; padding-top: 12px; padding-left: 8px;";
    newHeading.textContent = heading.textContent;
    heading.parentNode.replaceChild(newHeading, heading);
    return newHeading;
}

function createGraphExpansionCard(category, labels, data) {
    console.log("creating panel");
    const expansionCard = document.createElement("div");

    const expandButtonDiv = document.createElement("div");
    const expandButton = document.createElement("button");
    expandButton.innerHTML = "<h3>+ Graph</h3>";
    expandButton.style = "margin-left: 8px;";
    expandButtonDiv.style = "border: 1px solid rgb(237, 238, 240); cursor: pointer;"
    expandButtonDiv.appendChild(expandButton);

    const dataset = createDatasetFromData(category, labels, []);
    const graphCanvas = document.createElement("canvas");
    const chart = createGraphElement(graphCanvas, dataset);

    console.log("created chart");

    const graphPanel = document.createElement("div");
    for (const type of discipline.getStatsToGraph()) {
        const typeData = data.map(element => element[type]);
        console.log(data);
        console.log(typeData);
        const activateButton = document.createElement("button");
        activateButton.textContent = type;
        activateButton.className = "ds-inline-flex ds-items-center ds-rounded-3xl ds-border ds-h-6  ds-bg-ui-fill ds-text-typo ds-border-ui-stroke ds-cursor-pointer ds-pl-3 ds-pr-3 hover:ds-bg-ui-fill-hover hover:ds-border-ui-stroke-hover focus:ds-bg-ui-fill-hover focus:ds-border-ui-stroke-hover active:ds-bg-ui-fill-primary active:ds-border-ui-stroke-primary active:ds-text-typo-inverse1 ds-mr-2 ds-whitespace-nowrap";
        activateButton.onclick = function() {
            updateGraphElement(chart, labels, typeData);
        }
        graphPanel.appendChild(activateButton);
    }
    graphPanel.style = "margin: 8px;";

    graphPanel.style.display = "none";
    graphPanel.appendChild(graphCanvas);

    expandButtonDiv.onclick = function() {
        if (expandButton.innerHTML == "<h3>+ Graph</h3>") {
            expandButton.innerHTML = "<h3>- Graph</h3>";
            graphPanel.style.display = "block";
        } else if (expandButton.innerHTML == "<h3>- Graph</h3>") {
            expandButton.innerHTML = "<h3>+ Graph</h3>";
            graphPanel.style.display = "none";
        }
    }

    expansionCard.appendChild(expandButtonDiv);
    expansionCard.appendChild(graphPanel);
    expansionCard.style = "margin: 4px; border: 1px solid rgb(237, 238, 240);"
    return expansionCard;
}

// Global (script-level) variable to track which discipline is currently
// selected. This is updated by the onRemove function when a "tippy"
// dropdown for the discipline is removed.
// FIXME: Remove this by redesigning a little bit. This is very ugly.
let discipline = new Discipline();
discipline.getCurrentDiscipline(document);

function main() {
    console.log("running main");
    let headingsToMatch = ["vs Team", "In Host Country", "in Continent", "Home vs Away", "By Year", "By Season"];

    // Get the matching text headings.
    let textHeadings = [];
    for (const heading of document.querySelectorAll("h5")) {
        const largerHeading = increaseHeadingSize(heading);
        if (headingsToMatch.includes(heading.textContent)) {
            console.log(heading.textContent);
            textHeadings.push(largerHeading);
        }
    }

    for (const textHeading of textHeadings) {
        console.log(textHeading);

        let data = []
        if (discipline.current == "Batting") {
            data = getBattingData(textHeading);
        } else if (discipline.current == "Bowling") {
            data = getBowlingData(textHeading);
        } else if (discipline.current == "Fielding") {
            data = getFieldingData(textHeading);
        } else {
            // Invalid selection. Do nothing.
            return;
        }
        console.log(data);
        const labels = data.map(element => element.name);
        const graphExpansionCard = createGraphExpansionCard(textHeading.textContent, labels, data);
        textHeading.parentNode.insertBefore(graphExpansionCard, textHeading.nextSibling);
    }
}

// Helper functions for loading/reloading the extension.

function onRemove(element, onDetachCallback) {
    const observer = new MutationObserver(function () {
        function isDetached(el) {
            if (el.parentNode === document) {
                return false;
            } else if (el.parentNode === null) {
                return true;
            } else {
                return isDetached(el.parentNode);
            }
        }

        if (isDetached(element)) {
            observer.disconnect();
            // Wait because there's a race condition somewhere.
            setTimeout(() => {
                discipline.getCurrentDiscipline(document);
                onDetachCallback();
            }, 200);
        }
    })

    observer.observe(document, {
         childList: true,
         subtree: true
    });
}

// Check if the format dropdown or the stats discipline dropdown (bowling, batting, etc.)
// have been closed. If they have then the main function has to be re-run to inject the
// required scripts again.
var x = new MutationObserver(function (e) {
    for (const mutation of e) {
        for (const added of mutation.addedNodes) {
            // Just reload when we see an id containing "tippy-" i.e. any
            // dropdown. There seems to be different "tippy numbers" used depending
            // on exactly which route the user took to get there. Sometimes tippy-12
            // and tippy-13 are used other times it's tippy-39 and tippy-40. These
            // numbers could also change in the future. While doing this isn't ideal,
            // it's the best that can be done and shouldn't have any negative impacts.
            if (added.id.includes("tippy-")) {
                onRemove(added, main);
            }
        }
    }
});
x.observe(document.body, { childList: true });

// FIXME: This probably isn't the best way to do this.
//
// Since cricinfo is some sort of SPA the URL changes aren't always captured
// correctly by the Addon APIs. This means that if a player's page is
// navigated to through the homepage the script will not be run or injected
// correctly if trying to match the "bowling-batting-stats" page directly.
//
// Instead, we inject the script for any pages in the www.espncricinfo.com/cricketers/ 
// tree and check if the current URL is ever changed to include "bowing-batting-stats"
// (or the stats page). If it is, run the main function again.
//
// This is pretty hacky but it works for now.
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (location.href.includes("://www.espncricinfo.com/cricketers/") && location.href.includes("/bowling-batting-stats")) {
        discipline.getCurrentDiscipline(document);
        main();
    }
  }
}).observe(document, {subtree: true, childList: true});

main();
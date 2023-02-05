console.log("hello there this is working!");

class DataRow {
    constructor(name, matches, runs, average, balls_faced) {
        this.name = name;
        this.matches = parseInt(matches);
        this.runs = parseInt(runs);
        this.average = parseFloat(average);
        this.balls_faced = parseInt(balls_faced);
    }
}

// Main graphing functions

function createGraphElement(node, labels, data) {
    console.log(labels);
    const dataset = {
        labels: labels,
        datasets: [{
            label: "Player vs Team",
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

    const element = node.parentNode.insertBefore(document.createElement("canvas"), node.nextSibling);
    const chart = new Chart(element.getContext("2d"), {
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
    return element;
}

function getVsTeamData(heading) {
    const table = heading.parentNode.querySelector("tbody");
    console.log(table);
    let teams = [];
    for (const row of table.rows) {
        const cols = row.cells;
        console.log(cols[0].innerText, cols[5].innerText, cols[6].innerText, cols[7].innerText);
        // This is standard across batting tables.
        const dataRow = new DataRow(
            cols[0].innerText, // Team Name
            cols[2].innerText, // Num Matches
            cols[5].innerText, // Runs
            cols[7].innerText, // Avg
            cols[8].innerText  // HS
        );
        teams.push(dataRow);
    }

    return teams;
}

function increaseHeadingSize(heading) {
    const newHeading = document.createElement("h2");
    newHeading.className = "ds-font-bold";
    newHeading.style = "font-size: var(--font-size-text-base); line-height: 1.3; padding: 12px;";
    newHeading.textContent = heading.textContent;
    heading.parentNode.replaceChild(newHeading, heading);
    return newHeading;
}

function main() {
    console.log("running main");
    let headersToMatch = ["vs Team", "In Host Country", "in Continent", "Home vs Away", "By Year", "By Season"];

    // Get the matching text headings.
    let textHeadings = [];
    for (const heading of document.querySelectorAll("h5")) {
        const largerHeading = increaseHeadingSize(heading);
        if (headersToMatch.includes(heading.textContent)) {
            console.log(heading.textContent);
            textHeadings.push(largerHeading);
        }
    }


    let graph = Object.assign(...headersToMatch.map(k => ({ [k]: null })));
    console.log(graph);
    let showingGraph = Object.assign(...headersToMatch.map(k => ({ [k]: false })));

    for (const textHeading of textHeadings) {
        console.log(textHeading);
        let data = getVsTeamData(textHeading);
        console.log(data);

        const deactivateButton = document.createElement("button");
        deactivateButton.innerHTML = "Hide graph";
        deactivateButton.onclick = function() {
            const category = textHeading.textContent;
            console.log(category, showingGraph[category]);
            if (showingGraph[category]) {
                graph[category].remove();
                graph[category] = null;
                showingGraph[category] = false;
            }
        }
        deactivateButton.style = "padding-left: 8px;";
        textHeading.parentNode.insertBefore(deactivateButton, textHeading.nextSibling);

        const labels = data.map(element => element.name);
        for (const type of ["runs", "matches", "average"]) {
            const typeData = data.map(element => element[type]);
            console.log(typeData);
            const activateButton = document.createElement("button");
            activateButton.innerHTML = "Show " + type + " graph";
            activateButton.onclick = function() {
                const category = textHeading.textContent;
                console.log(category, showingGraph[category]);
                if (!showingGraph[category]) {
                    graph[category] = createGraphElement(deactivateButton, labels, typeData);
                    showingGraph[category] = true;
                }
            }
            activateButton.style = "padding-left: 8px; padding-right: 8px;";
            textHeading.parentNode.insertBefore(activateButton, textHeading.nextSibling);
        }
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
            onDetachCallback();
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
        main();
    }
  }
}).observe(document, {subtree: true, childList: true});

main();
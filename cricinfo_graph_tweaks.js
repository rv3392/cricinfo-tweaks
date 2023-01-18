console.log("hello there this is working!");

class VsTeamRow {
    constructor(name, matches, runs, average, balls_faced) {
        this.name = name;
        this.matches = parseInt(matches);
        this.runs = parseInt(runs);
        this.average = parseFloat(average);
        this.balls_faced = parseInt(balls_faced);
    }
}

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
        const dataRow = new VsTeamRow(
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

function main() {
    let h5 = null;

    for (const h of document.querySelectorAll("h5")) {
        if (h.textContent.includes("vs Team")) {
            console.log(h.textContent);
            h5 = h;
            break;
        }
    }

    let graph = null;
    let showingGraph = false;

    if (h5) {
        let data = getVsTeamData(h5);

        const deactivateButton = document.createElement("button");
        deactivateButton.innerHTML = "Hide graph";
        deactivateButton.onclick = function() { 
            if (showingGraph) {
                graph.remove();
                showingGraph = false;
            }
        }
        deactivateButton.style = "padding-left: 8px;";
        h5.parentNode.insertBefore(deactivateButton, h5.nextSibling);

        const labels = data.map(element => element.name);
        for (const type of ["runs", "matches", "average"]) {
            const typeData = data.map(element => element[type]);
            console.log(typeData);
            const activateButton = document.createElement("button");
            activateButton.innerHTML = "Show " + type + " graph";
            activateButton.onclick = function() { 
                if (!showingGraph) {
                    graph = createGraphElement(deactivateButton, labels, typeData);
                    showingGraph = true;
                }
            }
            activateButton.style = "padding-left: 8px; padding-right: 8px;";
            h5.parentNode.insertBefore(activateButton, h5.nextSibling);
        }
    }
}

main();
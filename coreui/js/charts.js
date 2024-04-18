/* global Chart */

/**
 * --------------------------------------------------------------------------
 * CoreUI Boostrap Admin Template (v4.2.2): main.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */



// random Numbers
const random = () => Math.round(Math.random() * 100);

function formatDate(dateString) {
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

(async () => {
  let response = await fetch(`/dashboard/data`)
  let data = await response.json()

  document.getElementById('latest').innerHTML = `
    <div class="card-body">
      <svg style="width: 1.5em; height: 1.5em;">
      <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-calendar"></use>
      </svg>
      <strong>${data.allLocations[0].location}</strong>: ${formatDate(data.latestPosts[0].timestamp)}
    </div>

    <div class="card-body">
      <svg style="width: 1.5em; height: 1.5em;">
      <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-calendar"></use>
      </svg>
      <strong>${data.allLocations[1].location}</strong>: ${formatDate(data.latestPosts[1].timestamp)}
    </div>

    <div class="card-body">
      <svg style="width: 1.5em; height: 1.5em;">
        <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-calendar"></use>
      </svg>
      <strong>${data.allLocations[2].location}</strong>: ${formatDate(data.latestPosts[2].timestamp)}
    </div>
  `
  document.getElementById('health').innerHTML = `
    <div class="card-body">
    <svg style="width: 1.5em; height: 1.5em;">
      <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-paw"></use>
    </svg>
    <strong>${data.allLocations[0].location}</strong>: ${data.latestPosts[0].health_issue}
    </div>

    <div class="card-body">
    <svg style="width: 1.5em; height: 1.5em;">
      <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-paw"></use>
    </svg>
    <strong>${data.allLocations[1].location}</strong>: ${data.latestPosts[1].health_issue}
    </div>
  
    <div class="card-body">
    <svg style="width: 1.5em; height: 1.5em;">
      <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-paw"></use>
    </svg>
    <strong>${data.allLocations[2].location}</strong>: ${data.latestPosts[2].health_issue}
    </div>

  `

  // eslint-disable-next-line no-unused-vars
  const barChart1 = new Chart(document.getElementById('canvas-2'), {
    type: 'bar',
    data: {
      labels: [data.allLocations[0].location, data.allLocations[1].location, data.allLocations[2].location],
      datasets: [{
        backgroundColor: 'rgba(204, 85, 0, 0.5)', // Burnt orange background color
        borderColor: 'rgba(204, 85, 0, 0.8)', // Burnt orange border color
        highlightFill: 'rgba(204, 85, 0, 0.75)', // Burnt orange highlight fill color
        highlightStroke: 'rgba(204, 85, 0, 1)',
        
        data: [data.latestPosts[0].food_added, data.latestPosts[1].food_added, data.latestPosts[2].food_added]
      }]
    },
    options: {
      responsive: true,
      
      scales: {
        x: {
          title: {
            display: true,
            text: 'Feeding Site',
            font: {weight: 'bold', size: 15}
          }
        },
        y: {
          title: {
            display: true,
            text: 'Food (kg)',
            font: {weight: 'bold', size: 15}

          }
        }
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  const barChart2 = new Chart(document.getElementById('canvas-2-1'), {
    type: 'bar',
    data: {
      labels: [data.allLocations[0].location, data.allLocations[1].location, data.allLocations[2].location],
      datasets: [{
        backgroundColor: 'rgba(151, 187, 205, 0.5)',
        borderColor: 'rgba(151, 187, 205, 0.8)',
        highlightFill: 'rgba(151, 187, 205, 0.75)',
        highlightStroke: 'rgba(151, 187, 205, 1)',
        data: [data.latestPosts[0].water_added, data.latestPosts[1].water_added, data.latestPosts[2].water_added]
      }]
    },
    options: {
      responsive: true,
      
      scales: {
        x: {
          title: {
            display: true,
            text: 'Feeding Site',
            font: {weight: 'bold', size: 15}

          }
        },
        y: {
          title: {
            display: true,
            text: 'Water (Liters)',
            font: {weight: 'bold', size: 15}

          }
        }
      }
    }
  });

})()



// eslint-disable-next-line no-unused-vars
const doughnutChart = new Chart(document.getElementById('canvas-3'), {
  type: 'doughnut',
  data: {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  },
  options: {
    responsive: true
  }
});

// eslint-disable-next-line no-unused-vars
const radarChart = new Chart(document.getElementById('canvas-4'), {
  type: 'radar',
  data: {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgba(220, 220, 220, 0.2)',
      borderColor: 'rgba(220, 220, 220, 1)',
      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
      pointBorderColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(220, 220, 220, 1)',
      data: [65, 59, 90, 81, 56, 55, 40]
    }, {
      label: 'My Second dataset',
      backgroundColor: 'rgba(151, 187, 205, 0.2)',
      borderColor: 'rgba(151, 187, 205, 1)',
      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
      pointBorderColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(151, 187, 205, 1)',
      data: [28, 48, 40, 19, 96, 27, 100]
    }]
  },
  options: {
    responsive: true
  }
});

// eslint-disable-next-line no-unused-vars
const pieChart = new Chart(document.getElementById('canvas-5'), {
  type: 'pie',
  data: {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  },
  options: {
    responsive: true
  }
});

// eslint-disable-next-line no-unused-vars
const polarAreaChart = new Chart(document.getElementById('canvas-6'), {
  type: 'polarArea',
  data: {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [{
      data: [11, 16, 7, 3, 14],
      backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB']
    }]
  },
  options: {
    responsive: true
  }
});
//# sourceMappingURL=charts.js.map